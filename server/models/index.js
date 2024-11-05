const db = require("../config/mysql");
const { sql, connectToDatabase } = require("../config/sqlserver");
const processModels = {
  login: async (username, password) => {
    const [rows] = await db.query(
      "SELECT * FROM account where username = ? AND password = ?",
      [username, password]
    );
    return rows[0];
  },
  getAllStepByIdProcess: async (idProcess, page, limit) => {
    const query = `
      SELECT 
        sp.MaSanPham, 
        qtcn.SoPhieu AS N'quy_trinh', 
        tg.ThuTu AS N'thoi_gian', 
        cdc.TenCongDoan AS N'ten_cong_doan', 
        cdc.MaCongDoan AS N'ma_cong_doan',
        cdc.CapBacCongDoan, 
        cumCD.MaCum, 
        cumCD.TenCum,
        cumCD.TenCumSAM, 
        clsp.TenChungLoai, 
        clsp.TenChungLoaiSAM, 
        clsp.MaChungLoai, 
        clsp.TenChungLoaiTiengAnh
        FROM 
            DM_SanPham AS sp
        INNER JOIN 
            NV_QuiTrinhCongNghe AS qtcn ON sp.Oid = qtcn.SanPham
        INNER JOIN 
            NV_QuiTrinhCongNghe_ChiTiet AS qtcn_ct ON qtcn.Oid = qtcn_ct.QuiTrinh
        INNER JOIN 
            DM_ThoiGian AS tg ON qtcn_ct.ThoiGianDM = tg.Oid
        INNER JOIN 
            DM_CongDoanChuan AS cdc ON qtcn_ct.CongDoanChuan = cdc.Oid
        INNER JOIN 
            DM_CumCongDoan AS cumCD ON qtcn_ct.CumCongDoanC = cumCD.Oid
        INNER JOIN 
            DM_ChungLoaiSanPham AS clsp ON sp.ChungLoaiSanPham = clsp.Oid 
      WHERE 
           qtcn.SoPhieu = @quy_trinh
      ORDER BY 
          sp.MaSanPham  -- Hoặc cột khác mà bạn muốn sắp xếp
      OFFSET (@Offset - 1) ROWS  -- Giảm 1 để bắt đầu từ 0
      FETCH NEXT @Limit ROWS ONLY;
    `;

    let queryCount = `
      select count(*) as 'so_luong'
      from DM_SanPham as sp
      inner join NV_QuiTrinhCongNghe as qtcn on sp.Oid = qtcn.SanPham
      inner join NV_QuiTrinhCongNghe_ChiTiet as qtcn_ct on qtcn.Oid = qtcn_ct.QuiTrinh
      inner join DM_ThoiGian as tg on qtcn_ct.ThoiGianDM = tg.Oid
      inner join DM_CongDoanChuan as cdc on qtcn_ct.CongDoanChuan = cdc.Oid
      inner join DM_CumCongDoan as cumCD on qtcn_ct.CumCongDoanC = cumCD.Oid
      inner join DM_ChungLoaiSanPham as clsp on sp.ChungLoaiSanPham = clsp.Oid 
      where qtcn.SoPhieu = @quy_trinh
    `;
    try {
      const pool = await connectToDatabase();
      // lấy tổng số lượng của qui trình

      const totalResult = await pool
        .request()
        .input("quy_trinh", sql.VarChar, idProcess)
        .query(queryCount);

      const totalItems = totalResult.recordset[0].so_luong;

      const process = await pool
        .request()
        .input("Offset", sql.Int, page)
        .input("Limit", sql.Int, limit)
        .input("quy_trinh", sql.VarChar, idProcess)
        .query(query);
      const totalPages = Math.ceil(totalItems / limit);

      return {
        process: process.recordset,
        totalPages,
        totalItems,
      };
    } catch (error) {
      console.error("Lỗi truy vấn:", err);
      throw error;
    } finally {
      sql.close(); // Đóng kết nối sau khi truy vấn xong
    }
  },
  getAllProcessByIdMaHang: async (idMaHang) => {
    const query = `
    select distinct qtcn.SoPhieu as N'qui_trinh'
    from DM_SanPham as sp
    inner join NV_QuiTrinhCongNghe as qtcn on sp.Oid = qtcn.SanPham
    inner join NV_QuiTrinhCongNghe_ChiTiet as qtcn_ct on qtcn.Oid = qtcn_ct.QuiTrinh
    inner join DM_ThoiGian as tg on qtcn_ct.ThoiGianDM = tg.Oid
    inner join DM_CongDoanChuan as cdc on qtcn_ct.CongDoanChuan = cdc.Oid
    inner join DM_CumCongDoan as cumCD on qtcn_ct.CumCongDoanC = cumCD.Oid
    inner join DM_ChungLoaiSanPham as clsp on sp.ChungLoaiSanPham = clsp.Oid
    where sp.MaSanPham = @masanpham 
    `;
    try {
      const pool = await connectToDatabase();
      const result = await pool
        .request()
        .input("masanpham", sql.VarChar, idMaHang)
        .query(query);
      return result.recordset;
    } catch (error) {
      console.error("Lỗi truy vấn:", err);
      throw error;
    } finally {
      sql.close(); // Đóng kết nối sau khi truy vấn xong
    }
  },

  getInfoProcessByIdProcess: async (idProcess) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      await connection.commit();
    } catch (error) {
      await connection.rollback(); // Rollback nếu có lỗi
      throw error;
    } finally {
      connection.release();
    }
  },
};
module.exports = processModels;
