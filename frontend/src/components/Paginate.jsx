import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";

function Paginate({ page, pages, admin = false, keyword = "" }) {
  return (
    pages > 1 && (
      <Pagination
        count={pages}
        page={Number(page)}
        variant="outlined"
        shape="rounded"
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          "& .Mui-selected": {
            backgroundColor: "#198754",
            color: "#fff",
          },
          "& .MuiPaginationItem-root": {
            border: "1px solid #ddd",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
          },
        }}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            component={Link}
            to={
              admin
                ? `/admin/products/page/${item.page}`
                : keyword
                ? `/search/${keyword}/page/${item.page}`
                : `/page/${item.page}`
            }
          />
        )}
      />
    )
  );
}

export default Paginate;
