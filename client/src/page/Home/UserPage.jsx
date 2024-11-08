import { EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Pagination,
  Select,
  Spin,
  Table,
  Typography,
} from "antd";
import { createStyles } from "antd-style";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { http } from "../../api";
import Video from "../../components/Video";

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

const UserPage = () => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const { styles } = useStyle();
  const [query, setQuery] = useState({
    ma_hang: null,
  });
  const [optionsMH, setOptionsMH] = useState({
    value: "",
    label: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [totalPage, setTotalPage] = useState(null);
  const [totalItem, setTotalItem] = useState(null);

  const [congDoans, setCongDoans] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //modal
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [videoCongDoan, setVideoCongDoan] = useState(null);

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
      key: "ten_cong_doan",
      title: (
        <Typography.Text className="text-[16px] whitespace-nowrap">
          Tên công đoạn
        </Typography.Text>
      ),
      dataIndex: "ten_cong_doan",
      //   ...getColumnSearchProps("ten_cong_doan"),
      render: (ten_cong_doan) => (
        <Typography.Text className="text-[16px]">
          {ten_cong_doan}
        </Typography.Text>
      ),
    },
    {
      key: "video",
      title: <Typography.Text className="text-[16px]">Video</Typography.Text>,
      dataIndex: "video",
      render: (video) => (
        <Button type="default" onClick={() => handleOpen(video)}>
          Xem
        </Button>
      ),
    },
  ];

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = (video) => {
    setIsLoadingModal(true);
    console.log(video);
    // Giả lập quá trình tải video
    setTimeout(() => {
      setIsLoadingModal(false);
      setVideoCongDoan(video);
      setIsOpen(true);
    }, 2000); // Thời gian tải video, bạn có thể điều chỉnh theo nhu cầu
  };

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

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleGetAllCongDoanByIdMaHang = async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await http.getAllCongDoanByIdMaHang(
        token,
        query.ma_hang,
        page
      );
      if (res.status === 200) {
        toast.success(res.data.messages);
        const { currentPage, totalItems, totalPages, congdoans, limit } =
          res.data;
        setCurrentPage(currentPage);
        setLimit(limit);
        setCongDoans(congdoans);
        setTotalPage(totalPages);
        setTotalItem(totalItems);
      } else if (res.status !== 200) {
        toast.error(res.data.message);
        setCongDoans([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const data = congDoans?.map((p, i) => {
      return {
        key: p.stt,
        stt: p.stt,
        ten_cong_doan: p.ten_cong_doan,
        video: p.video,
      };
    });
    setDataSource(data);
  }, [congDoans]);

  useEffect(() => {
    if (query.ma_hang) {
      handleGetAllCongDoanByIdMaHang();
    }
  }, [query.ma_hang]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchAllMaHang()]);
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
          total={totalItem}
          pageSize={limit}
          onChange={handleChangePage}
          showSizeChanger={false}
          className="items-center justify-center"
        />
      )}

      {isLoadingModal && (
        <div className="overlay">
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 48, color: "#fff" }} spin />
            }
          />
        </div>
      )}
      <Modal
        title="VIDEO"
        open={isOpen}
        width={"80%"}
        footer={null}
        onCancel={handleClose}
        destroyOnClose
        style={{
          top: 20,
          height: "80vh",
        }}
      >
        {/* <div
          style={{
            height: "100%",
          }}
        >
        </div> */}
        <Video url={videoCongDoan} />
      </Modal>
    </div>
  );
};

export default UserPage;
