import { Button, Input, Pagination, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { createStyles } from "antd-style";
import { UploadOutlined } from "@ant-design/icons";
import { http } from "../../api";
import { toast } from "react-toastify";

const useStyle = createStyles(({ css, token }) => {
  const { antCls } = token;
  return {
    customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: #eaeaea transparent;
            scrollbar-gutter: stable;
          }
        }
      }
    `,
  };
});

const columns = [
  {
    title: "Tên công đoạn",
    dataIndex: "ten_cong_doan",
  },
  {
    title: "Thời gian",
    dataIndex: "time",
  },
  {
    title: "Cấp bậc công việc",
    dataIndex: "cap_bac_cong_doan",
  },
  {
    title: "Upload",
    key: "upload",
    fixed: "right",
    render: () => <Button icon={<UploadOutlined />} />,
  },
];

const HomePage = () => {
  const { styles } = useStyle();
  const [query, setQuery] = useState({
    ma_hang: "",
    qui_trinh: "",
  });
  const [processArray, setProcessArray] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maHangArray, setMaHangArray] = useState(null);
  const [options, setOptions] = useState({
    value: "",
    label: "",
  });
  const [totalPage, setTotalPage] = useState(null);
  const [totalItem, setTotalItem] = useState(null);

  const [dataSource, setDataSource] = useState([]);

  const handleChange = (e, type) => {
    if (type === "ma_hang") {
      setQuery((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    } else if (type === "qui_trinh") {
      setQuery((prev) => ({
        ...prev,
        ["qui_trinh"]: e,
      }));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleGetProcessByIdMaHang();
    }
  };

  const handleGetProcessByIdMaHang = async () => {
    const res = await http.getProcessByIdMaHang(query.ma_hang);
    console.log(query);
    const { data } = res;
    if (res.status === 200) {
      toast.success(res.data.message);
      const quitrinh = data.result.map((d) => {
        return {
          value: d.qui_trinh,
          label: d.qui_trinh,
        };
      });
      console.log(quitrinh);
      setOptions(quitrinh);
    } else if (res.status === 400) {
      toast.error(res.data.message);
    }
  };

  const handleShowAllProcess = async () => {
    const res = await http.getAllStepByIdProcess(query.qui_trinh);
    if (res.status === 200) {
      toast.success(res.data.message);
      const { currentPage, totalItems, totalPages, process } = res.data;
      setCurrentPage(currentPage);
      setProcessArray(process);
      setTotalPage(totalPages);
      setTotalItem(totalItems);
    } else {
      toast.error(res.data.message);
    }
  };

  const handleChangePage = (page, pageSize) => {
    setCurrent(page);
    setTotalItem(pageSize);
  };
  useEffect(() => {
    if (query.qui_trinh) {
      handleShowAllProcess();
    }
  }, [query.qui_trinh]);

  useEffect(() => {
    const data = processArray?.map((p) => {
      return {
        ten_cong_doan: p.ten_cong_doan,
        time: p.thoi_gian,
        cap_bac_cong_doan: p.CapBacCongDoan,
      };
    });
    setDataSource(data);
  }, [processArray]);
  return (
    <div className="wrapper wrapper-main">
      <h2 className="text-[35px] font-semibold">
        Danh sách công đoạn theo mã hàng
      </h2>
      <div className="flex flex-row items-center justify-start">
        <form className="my-4 flex flex-row gap-5">
          <Input.Search
            placeholder="Nhập tên mã hàng"
            size="large"
            name="ma_hang"
            onChange={(e) => handleChange(e, "ma_hang")}
            onKeyDown={handleKeyDown}
          />
          <Select
            size="large"
            showSearch
            placeholder="Mã quy trình"
            options={options}
            name="qui_trinh"
            onChange={(e) => handleChange(e, "qui_trinh")}
          />
        </form>
      </div>
      <Table
        className={styles.customTable}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        page={totalItem}
        total={totalPage}
        onChange={handleChangePage}
        showSizeChanger
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default HomePage;
