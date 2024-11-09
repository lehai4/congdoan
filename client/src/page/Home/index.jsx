import {
  EditOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Modal,
  Pagination,
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
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const userParse = JSON.parse(user);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [link, setLink] = useState(null);
  const [isValidProcess, setIsValidProcess] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isType, setIsType] = useState(null);

  const showModal = async (data, type) => {
    setDataModal(data);

    // console.log(type);
    setIsType(type);
    if (type === "edit") {
      const res = await http.getAllCongDoan();
      // console.log(res.data);
      const existLink =
        res &&
        res.data &&
        res.data.find(
          (item) =>
            item.ma_san_pham === data.ma_hang &&
            item.ten_qui_trinh === data.quy_trinh &&
            item.ma_cong_doan === data.ma_cong_doan
        ).video;
      // console.log(existLink);
      setLink(existLink);
      setIsModalOpen(true);
    } else if (type === "add") {
      setIsModalOpen(true);
    }
  };

  const convertLink = (url) => {
    const baseURL = "https://youtu.be/";
    const videoID = url.replace(baseURL, "");

    return "https://www.youtube.com/embed/" + videoID;
  };

  const handleAddLinkVideo = async () => {
    if (!link) {
      toast.info("Vui lòng thêm link.!");
      return;
    }
    try {
      const data = {
        ...dataModal,
        video: convertLink(link),
      };
      const saveStore = {
        ma_cong_doan: dataModal.ma_cong_doan,
        ma_hang: dataModal.ma_hang,
        quy_trinh: dataModal.quy_trinh,
        stt: dataModal.stt,
      };
      const res = await http.uploadProcess(token, data);
      await http.addProcessIsSaveLink(token, saveStore);
      fetchAllProcessIsSaveLink();
      handleShowAllProcess(currentPage);
      toast.success(res.data.message);
      setIsModalOpen(false);
      setLink(null);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleEditLinkVideo = async () => {
    try {
      const data = {
        ...dataModal,
        video: convertLink(link),
      };
      const saveStore = {
        ma_cong_doan: dataModal.ma_cong_doan,
        ma_hang: dataModal.ma_hang,
        quy_trinh: dataModal.quy_trinh,
        stt: dataModal.stt,
      };
      const res = await http.uploadProcess(token, data);
      await http.addProcessIsSaveLink(token, saveStore);
      fetchAllProcessIsSaveLink();
      handleShowAllProcess(currentPage);
      toast.success("Cập nhật thành công");
      setIsModalOpen(false);
      setLink(null);
    } catch (err) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleCancel = () => {
    setLink(null);
    setIsModalOpen(false);
  };

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
          placeholder={`${dataIndex}`}
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
            size="small"
            icon={<SearchOutlined />}
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
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
      title: <p className="text-[16px] whitespace-nowrap">STT</p>,
      dataIndex: "stt",
      render: (stt) => <p className="text-[16px]">{stt}</p>,
    },
    {
      key: "ma_hang",
      width: 120,
      title: <p className="text-[16px] whitespace-nowrap">Tên mã hàng</p>,
      dataIndex: "ma_hang",
      render: (ma_hang) => (
        <p className="text-[16px] flex justify-center items-center whitespace-nowrap">
          {ma_hang}
        </p>
      ),
    },
    {
      key: "ten_cong_doan",
      title: <p className="text-[16px] whitespace-nowrap">Tên công đoạn</p>,
      dataIndex: "ten_cong_doan",
      ...getColumnSearchProps("ten_cong_doan"),
      render: (ten_cong_doan) => (
        <p className="text-[16px] w-[350px] lg:w-[800px]">{ten_cong_doan}</p>
      ),
    },
    {
      key: "time",
      width: 100,
      title: <p className="text-[16px] whitespace-nowrap">Thời gian</p>,
      dataIndex: "time",
      render: (time) => (
        <p className="text-[16px] flex justify-center items-center whitespace-nowrap">
          {time}
        </p>
      ),
    },
    {
      title: <p className="text-[16px]"></p>,
      dataIndex: "",
      key: "x",
      render: (data) => (
        <>
          {isValidProcess.some(
            (item) =>
              item.ma_hang === data.ma_hang &&
              item.quy_trinh === data.quy_trinh &&
              item.ma_cong_doan === data.ma_cong_doan
          ) ? (
            <Button
              type="default"
              size="middle"
              icon={<EditOutlined />}
              onClick={() => {
                showModal(data, "edit");
              }}
            >
              Edit Link
            </Button>
          ) : (
            <Button
              type="primary"
              size="middle"
              icon={<UploadOutlined />}
              onClick={() => {
                showModal(data, "add");
              }}
            >
              Thêm Link
            </Button>
          )}
        </>
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

  const fetchAllProcessIsSaveLink = async () => {
    const res = await http.getAllProcessIsSaveLink();
    setIsValidProcess(res.data);
  };

  const handleChange = (e, type) => {
    setQuery((prev) => ({
      ...prev,
      [type]: e,
    }));
  };

  const handleGetProcessByIdMaHang = async () => {
    if (userParse.role === "admin") {
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
    } else if (userParse.role === "user") {
      console.log("running....");
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
        ten_chung_loai: p.TenChungLoai,
        ma_cong_doan: p.ma_cong_doan,
        ten_cum: p.TenCum,
        ten_cum_sam: p.TenCumSAM,
        quy_trinh: p.quy_trinh,
        ma_cum: p.MaCum,
      };
    });
    setDataSource(data);
  }, [processArray]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchAllMaHang(), fetchAllProcessIsSaveLink()]);
      } catch (err) {
        setError(err); // Xử lý lỗi nếu có
      } finally {
        setLoading(false); // Đặt loading = false khi kết thúc
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }
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
          {userParse.role === "admin" && (
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
          )}
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
      <Modal
        title="Link Video"
        open={isModalOpen}
        // onOk={handleAddLinkVideo}
        onCancel={handleCancel}
        footer={[
          <Button key="link" type="default" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={
              isType === "add" ? handleAddLinkVideo : handleEditLinkVideo
            }
          >
            {isType === "add" ? "Thêm" : "Cập nhật"}
          </Button>,
        ]}
      >
        <Input
          type="link"
          placeholder="Link for video"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default HomePage;
