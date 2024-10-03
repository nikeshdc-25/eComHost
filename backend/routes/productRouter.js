import express from 'express';
import { addProduct, getProducts, getProductById, deleteProduct, updateProduct, getTopProduct, addUserReview } from '../controller/productController.js';
import { authCheck, checkAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(authCheck, checkAdmin, addProduct);
    router.get("/topproducts", getTopProduct);


router.route('/:id')
    .get(getProductById)
    .delete(authCheck, checkAdmin, deleteProduct)
    .put(authCheck, checkAdmin, updateProduct);
router.put('/:id/addreview', authCheck, addUserReview);       //Product id

export default router;
