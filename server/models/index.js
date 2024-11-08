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

  getAllCongDoan: async () => {
    const [rows] = await db.query(`SELECT * FROM pm_cong_doan`);
    return rows;
  },

  getAllMaHang: async () => {
    try {
      const query = `SELECT DISTINCT MaSanPham FROM DM_SanPham`;
      const pool = await connectToDatabase();
      const result = await pool.request().query(query);
      return result.recordset;
    } catch (err) {
      console.error("Lỗi truy vấn:", err);
      throw err;
    } finally {
      sql.close(); // Đóng kết nối sau khi truy vấn xong
    }
  },

  getAllProcessIsSaveLink: async () => {
    const [rows] = await db.query(`SELECT * FROM pm_no_allow_cd`);
    return rows;
  },

  getAllStepByIdProcess: async (idProcess, page, limit) => {
    const query = `
      SELECT 
        qtcn_ct.STT,
        sp.MaSanPham, 
        qtcn.SoPhieu AS N'quy_trinh', 
        tg.ThuTu AS N'time', 
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
          qtcn_ct.STT  -- Hoặc cột khác mà bạn muốn sắp xếp
      OFFSET ((@Offset - 1) * @Limit) ROWS
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
        limit,
      };
    } catch (error) {
      console.error("Lỗi truy vấn:", err);
      return error;
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
      return error;
    } finally {
      sql.close(); // Đóng kết nối sau khi truy vấn xong
    }
  },

  uploadProcessToDataBase: async (data) => {
    const paramData = {
      stt: data.stt,
      ma_san_pham: data.ma_hang,
      ten_qui_trinh: data.quy_trinh,
      thoi_gian: data.time,
      ten_cong_doan: data.ten_cong_doan,
      ten_chung_loai: data.ten_chung_loai,
      ma_cong_doan: data.ma_cong_doan,
      ten_cum_sam: data.ten_cum_sam,
      ten_cum: data.ten_cum,
      ma_cum: data.ma_cum,
      video: data.video ? data.video : "",
    };
    const query = `
    INSERT INTO pm_cong_doan (
      stt,ma_san_pham,ten_qui_trinh,thoi_gian,ten_cong_doan,ten_chung_loai,ma_cong_doan,ten_cum_sam,ten_cum,ma_cum,video
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     on duplicate key update
      thoi_gian = VALUES(thoi_gian),
      ten_cong_doan = VALUES(ten_cong_doan),
      ten_chung_loai = VALUES(ten_chung_loai),
      ten_cum_sam = VALUES(ten_cum_sam),
      ten_cum = VALUES(ten_cum),
      video = VALUES(video);
  `;

    // Tạo một mảng chứa các giá trị từ paramData
    const values = [
      paramData.stt,
      paramData.ma_san_pham,
      paramData.ten_qui_trinh,
      paramData.thoi_gian,
      paramData.ten_cong_doan,
      paramData.ten_chung_loai,
      paramData.ma_cong_doan,
      paramData.ten_cum_sam,
      paramData.ten_cum,
      paramData.ma_cum,
      paramData.video,
    ];
    // console.log(values);
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction(); //
      await connection.query(query, values);
      await connection.commit();
    } catch (error) {
      await connection.rollback(); // Rollback nếu có lỗi
      throw error;
    } finally {
      connection.release();
    }
  },

  addProcessIsSaveLink: async (data) => {
    const query = `
    INSERT INTO pm_no_allow_cd (
     ma_cong_doan, ma_hang, quy_trinh, stt
    ) VALUES (?, ?, ?, ?)
     on duplicate key update
     ma_cong_doan = values(ma_cong_doan),
     ma_hang = values(ma_hang),
     quy_trinh = values(quy_trinh),
     stt = values(stt)
  `;

    // Tạo một mảng chứa các giá trị từ paramData
    const values = [data.ma_cong_doan, data.ma_hang, data.quy_trinh, data.stt];
    // console.log("values của addProcessIsSaveLink", values);
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction(); //
      await connection.query(query, values);
      await connection.commit();
    } catch (error) {
      await connection.rollback(); // Rollback nếu có lỗi
      throw error;
    } finally {
      connection.release();
    }
  },

  //USER
  getAllCongDoanByIdMaHang: async (idMaHang, page, limit) => {
    const offset = (page - 1) * limit;

    try {
      let queryCount = `SELECT count(*) as total FROM pm_cong_doan WHERE
      ma_san_pham = ?`;

      let querySelect = `
        SELECT stt, ten_cong_doan, video FROM pm_cong_doan where ma_san_pham = '${idMaHang}' ORDER BY stt LIMIT ${limit} OFFSET ${offset}
      `;

      // Lấy tổng số công đoạn
      const [totalResult] = await db.query(queryCount, [idMaHang]);
      const totalItems = totalResult[0].total;

      // Lấy danh sách công đoạn với phân trang
      const [congdoans] = await db.query(querySelect);

      const totalPages = Math.ceil(totalItems / limit);

      return {
        congdoans,
        totalPages,
        totalItems,
        limit,
      };
    } catch (error) {
      console.error("Error in getAllNhanViens model:", error);
      throw error;
    }
  },
};
module.exports = processModels;
