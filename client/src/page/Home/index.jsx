import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { useCallback, useEffect, useState } from "react";
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
    title: "STT",
    dataIndex: "stt",
    render: (stt) => (
      <Typography.Text className="text-[16px]">{stt}</Typography.Text>
    ),
  },
  {
    title: "Tên Công Đoạn",
    dataIndex: "ten_cong_doan",
    render: (ten_cong_doan) => (
      <Typography.Text className="text-[16px]">{ten_cong_doan}</Typography.Text>
    ),
  },
  {
    title: "Thời gian",
    dataIndex: "time",
    render: (time) => (
      <Typography.Text className="text-[16px]">{time}</Typography.Text>
    ),
  },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: (e) => (
      <Space className="gap-4">
        <Popconfirm
          title="upload"
          description={`You are sure upload "${e.name}" ?`}
          onConfirm={() => {}}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
          style={{ width: 550 }}
        >
          <Button
            type="primary"
            size="middle"
            icon={<UploadOutlined />}
            onClick={() => {}}
          >
            Upload
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

const HomePage = () => {
  const { styles } = useStyle();
  const [query, setQuery] = useState({
    ma_hang: null,
    qui_trinh: null,
  });
  const [processArray, setProcessArray] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [options, setOptions] = useState([]);
  const [limit, setLimit] = useState(50);
  const [optionsMH, setOptionsMH] = useState({
    value: "",
    label: "",
  });

  const [totalPage, setTotalPage] = useState(null);
  const [totalItem, setTotalItem] = useState(null);

  const [dataSource, setDataSource] = useState([]);

  const fetchAllMaHang = async () => {
    const res = await http.getAllMaHang();
    const MH =
      res.status == 200
        ? res.data.map((d) => {
            return {
              value: d.MaSanPham,
              label: d.MaSanPham,
            };
          })
        : [];
    setOptionsMH(MH);
  };

  const handleChange = (e, type) => {
    setQuery((prev) => ({
      ...prev,
      [type]: e,
    }));
  };

  const handleGetProcessByIdMaHang = async () => {
    const res = await http.getAllProcessByIdMaHang(query.ma_hang);
    const { data } = res;
    if (res.status === 200) {
      toast.success(res.data.message);
      const quitrinh = data.result.map((d) => {
        return {
          value: d.qui_trinh,
          label: d.qui_trinh,
        };
      });
      setOptions(quitrinh);
      setQuery((prev) => ({
        ...prev,
        ["qui_trinh"]: null,
      }));
      setDataSource([]);
    } else if (res.status === 400) {
      setOptions([]);
      setQuery((prev) => ({
        ...prev,
        ["qui_trinh"]: null,
      }));
      setDataSource(null);
      toast.error(res.data.message);
    }
  };

  //chỉnh sửa
  const handleShowAllProcess = async (page = 1) => {
    const res = await http.getAllStepByIdProcess(query.qui_trinh ?? "", page);
    if (res.status === 200) {
      toast.success(res.data.message);
      const { currentPage, totalItems, totalPages, process, limit } = res.data;

      setCurrentPage(currentPage);
      setLimit(limit);
      setProcessArray(process);
      setTotalPage(totalPages);
      setTotalItem(totalItems);
    } else {
      toast.error(res.data.message);
    }
  };

  const fetchData = useCallback(async () => {
    await handleShowAllProcess(currentPage);
  }, [currentPage]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (query.ma_hang) {
      handleGetProcessByIdMaHang();
    }
  }, [query.ma_hang]);

  useEffect(() => {
    if (query.qui_trinh) {
      handleShowAllProcess();
    }
  }, [query.qui_trinh]);

  useEffect(() => {
    const data = processArray?.map((p, i) => {
      return {
        key: i,
        stt: p.STT,
        ten_cong_doan: p.ten_cong_doan,
        time: p.time,
      };
    });
    setDataSource(data);
  }, [processArray]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchAllMaHang();
  }, []);

  return (
    <div className="flex flex-col h-full justify-center">
      <h2 className="text-[35px] font-semibold">
        Danh sách công đoạn theo mã hàng
      </h2>
      <div className="flex flex-row items-center justify-start">
        <form className="my-4 flex flex-row gap-5">
          <Select
            size="middle"
            showSearch
            placeholder="Tên mã hàng"
            options={optionsMH}
            name="ma_hang"
            value={query.ma_hang}
            className="w-[170px]"
            onChange={(e) => handleChange(e, "ma_hang")}
          />
          <Select
            size="middle"
            showSearch
            placeholder="Chọn một tùy chọn"
            name="qui_trinh"
            value={query.qui_trinh}
            options={options}
            className="w-full"
            onChange={(e) => handleChange(e, "qui_trinh")}
          />
        </form>
      </div>
      <div className="mb-5 border">
        <Table
          className={`${styles.customTable}`}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: "max-content", y: 500 }}
        />
      </div>
      {dataSource && dataSource.length > 0 && (
        <Pagination
          current={currentPage}
          total={totalItem} // Tổng số sản phẩm là 100
          pageSize={limit} // Số sản phẩm mỗi trang là 50
          onChange={handleChangePage}
          showSizeChanger={false}
          className="items-center justify-center"
        />
      )}
    </div>
  );
};

export default HomePage;
