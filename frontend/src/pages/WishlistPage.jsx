import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Alert,
} from "@mui/joy";
import {
  useGetWishlistQuery,
  useRemoveWishlistMutation,
} from "../slices/wishlistSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { nepaliRupeesFormat } from "../utils/rupeesUtils";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { data: wishlist, isLoading, error, refetch } = useGetWishlistQuery();
  const [removeWishlist] = useRemoveWishlistMutation();

  const handleRemoveItem = async (productId) => {
    try {
      await removeWishlist(productId);
      toast.error("Removed from Wishlist.");
      refetch();
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  useEffect(() => {
    if (!isLoading && wishlist && wishlist.wishlistItems) {
      // Logic if needed to handle specific wishlist behavior
    }
  }, [wishlist, isLoading]);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: "20px", color: "black", minHeight: "100vh" }}>
      <h2 className="pb-2">My Wishlist</h2>
      {wishlist &&
      wishlist.wishlistItems &&
      wishlist.wishlistItems.length > 0 ? (
        wishlist.wishlistItems.map((item) => (
          <Card
            key={item.product._id}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              backgroundColor: "white",
              color: "black",
              marginBottom: "20px",
              padding: "10px",
              alignItems: "center", // Align content centrally
            }}
          >
            <Link to={`/product/${item.product._id}`} className="nav-link">
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "150px",
                  height: "auto",
                  borderRadius: "8px",
                  marginRight: "20px",
                }}
              />
            </Link>

            <CardContent sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {item.name}
              </Typography>
              <Typography variant="body2" sx={{ margin: "5px 0" }}>
                {item.discount > 0 ? (
                  <>
                    <span>Rs.</span>
                    <s className="price">
                      {nepaliRupeesFormat(item.price)}
                    </s>{" "}
                    <span className="discount">
                      {nepaliRupeesFormat(item.discountedPrice)}
                    </span>
                  </>
                ) : (
                  <span className="price">
                    Rs. {nepaliRupeesFormat(item.price)}
                  </span>
                )}
              </Typography>
              <Typography variant="body2" sx={{ margin: "5px 0" }}>
                Brand: {item.brand}
              </Typography>
              <Typography variant="body2" sx={{ margin: "5px 0" }}>
                Category: {item.category}
              </Typography>
            </CardContent>

            {/* Delete Button placed in its own column */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                onClick={() => handleRemoveItem(item.product._id)}
                sx={{ marginTop: "10px", color: "red" }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Card>
        ))
      ) : (
        <Typography sx={{ color: "green" }}>
          You don't have any items in your wishlist!
        </Typography>
      )}
    </Box>
  );
};

export default WishlistPage;
