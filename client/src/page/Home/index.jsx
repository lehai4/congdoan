import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
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
import { createStyles } from "antd-style";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { http } from "../../api";

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

const HomePage = () => {
  const { styles } = useStyle();
  const [query, setQuery] = useState({
    ma_hang: null,
    qui_trinh: null,
  });
  const [optionsMH, setOptionsMH] = useState({
    value: "",
    label: "",
  });

  const [processArray, setProcessArray] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [options, setOptions] = useState([]);
  const [limit, setLimit] = useState(50);

  const [totalPage, setTotalPage] = useState(null);
  const [totalItem, setTotalItem] = useState(null);

  const [dataSource, setDataSource] = useState([]);

  //dataTable
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      key: "STT",
      title: (
        <Typography.Text className="text-[16px] whitespace-nowrap">
          STT
        </Typography.Text>
      ),
      dataIndex: "stt",
      render: (stt) => (
        <Typography.Text className="text-[16px]">{stt}</Typography.Text>
      ),
    },
    {
      key: "ma_hang",
      width: 120,
      title: (
        <Typography.Text className="text-[16px] whitespace-nowrap">
          Tên mã hàng
        </Typography.Text>
      ),
      dataIndex: "ma_hang",
      render: (ma_hang) => (
        <Typography.Text className="text-[16px] flex justify-center items-center whitespace-nowrap">
          {ma_hang}
        </Typography.Text>
      ),
    },
    {
      key: "ten_cong_doan",
      title: (
        <Typography.Text className="text-[16px] whitespace-nowrap">
          Tên công đoạn
        </Typography.Text>
      ),
      dataIndex: "ten_cong_doan",
      ...getColumnSearchProps("ten_cong_doan"),
      render: (ten_cong_doan) => (
        <Typography.Text className="text-[16px] whitespace-nowrap">
          {ten_cong_doan}
        </Typography.Text>
      ),
    },
    {
      key: "time",
      width: 100,
      title: (
        <Typography.Text className="text-[16px] whitespace-nowrap">
          Thời gian
        </Typography.Text>
      ),
      dataIndex: "time",
      render: (time) => (
        <Typography.Text className="text-[16px] flex justify-center items-center whitespace-nowrap">
          {time}
        </Typography.Text>
      ),
    },
    {
      title: (
        <Typography.Text className="text-[16px] whitespace-nowrap"></Typography.Text>
      ),
      dataIndex: "",
      key: "x",
      render: (e) => (
        <Space className="gap-4">
          <Popconfirm
            title="Upload"
            description={`You are sure upload "${e.name}" ?`}
            onConfirm={() => {}}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No"
            placement="bottomLeft"
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
    try {
      setIsLoading(true);
      // console.log("running...");
      const res = await http.getAllStepByIdProcess(query.qui_trinh ?? "", page);
      if (res.status === 200) {
        toast.success(res.data.messages);
        const { currentPage, totalItems, totalPages, process, limit } =
          res.data;
        setCurrentPage(currentPage);
        setLimit(limit);
        setProcessArray(process);
        setTotalPage(totalPages);
        setTotalItem(totalItems);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
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
        key: p.STT,
        stt: p.STT,
        ma_hang: p.MaSanPham,
        ten_cong_doan: p.ten_cong_doan,
        time: p.time,
      };
    });
    setDataSource(data);
  }, [processArray]);

  // useEffect(() => {
  //   console.log(isLoading);
  // }, [isLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchAllMaHang();
  }, []);

  return (
    <div className="flex flex-col h-full justify-center">
      <h2 className="text-[32px] font-semibold">Danh sách công đoạn</h2>
      <div className="flex flex-row items-center justify-start">
        <form className="my-4 flex flex-row gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="ma_hang" className="text-[16px]">
              Tên mã hàng
            </label>
            <Select
              size="middle"
              showSearch
              placeholder="Lựa chọn mã hàng"
              options={optionsMH}
              name="ma_hang"
              value={query.ma_hang}
              className="w-[230px]"
              onChange={(e) => handleChange(e, "ma_hang")}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="qui_trinh" className="text-[16px]">
              Qui trình công nghệ
            </label>
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
          </div>
        </form>
      </div>
      <div className="my-5 border">
        <Table
          className={`${styles.customTable}`}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={isLoading}
          scroll={{ x: "max-content", y: 400 }}
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
