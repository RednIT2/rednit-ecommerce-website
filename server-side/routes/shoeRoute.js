const express = require('express');
const multer = require('multer');
const path = require('path');
const {v2: cloudinary} = require('cloudinary');
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const Shoe = require('../models/Shoe');

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Cấu hình multer với Cloudinary/
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'shoes', // Thư mục trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'avif'], // Các định dạng ảnh được phép
    }
})

const upload = multer({ storage: storage });

//API thêm giày mới
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const newShoe = new Shoe({
            name: req.body.name,
            type: req.body.type,
            sizes: req.body.sizes ? req.body.sizes.split(',').map(Number) : [], // Kiểm tra chuỗi sizes
            color: req.body.color,
            price: parseFloat(req.body.price.replace(/\./g, '')), // Xóa dấu chấm ngăn cách hàng nghìn
            stock: parseInt(req.body.stock, 10), // Chuyển stock thành số nguyên
            image: req.file ? req.file.path : null, // Lưu URL của ảnh trên Cloudinary
        });

        await newShoe.save();
        res.status(201).json({ message: 'Shoe added successfully!', shoe: newShoe });
    } catch (error) {
        console.error('Error adding shoe:', error);
        res.status(500).json({ message: 'Failed to add shoe.' });
    }
})

router.post('/generate-id', async (req, res) => {
    try {
        const { type } = req.body;

        const brandCode = type === "Puma" ? "PM" :
                          type === "Nike" ? "NK" :
                          type === "Adidas" ? "AD" : "XX";

        const count = await Shoe.countDocuments();
        const sequence = String(count + 1).padStart(4, '0');

        const generatedId = `SHOE${brandCode}${sequence}`;

        res.json({ generatedId });
    } catch (error) {
        console.error("Error generating ID:", error);
        res.status(500).json({ message: "Failed to generate ID." });
    }
});

// API lấy danh sách giày
router.get('/', async (req, res) => {
  try {
    const shoes = await Shoe.find();
    res.json(shoes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shoes.' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) {
      return res.status(404).json({ message: 'Shoe not found.' });
    }
    res.json(shoe);
  } catch (error) {
    console.error('Error fetching shoe details:', error);
    res.status(500).json({ message: 'Failed to fetch shoe details.' });
  }
});
const handleSave = (id, formData) => {
  setIsUpdating(true);
  axios
    .put(`${process.env.REACT_APP_API_URL}/shoes/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Đảm bảo gửi đúng định dạng
      },
    })
    .then((response) => {
      const updatedShoes = shoeList.map((shoe) =>
        shoe._id === id ? response.data : shoe
      );
      setShoeList(updatedShoes);
      setEditingId(null);
      setIsUpdating(false);
    })
    .catch((error) => {
      console.error("Error updating shoe:", error);
      setIsUpdating(false);
    });
};
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
      const { type, name, sizes, color, price, stock } = req.body;

      // Lấy sản phẩm hiện tại từ cơ sở dữ liệu
      const currentShoe = await Shoe.findById(req.params.id);
      if (!currentShoe) {
          return res.status(404).json({ message: 'Shoe not found.' });
      }

      // Tính toán lại brandCode dựa trên type mới
      const brandCode = type === "Puma" ? "PM" :
                        type === "Nike" ? "NK" :
                        type === "Adidas" ? "AD" : "XX";

      // Giữ nguyên tiền tố "SHOE" và chuỗi số cuối
      const prefix = currentShoe.id.slice(0, 4); // Lấy "SHOE"
      const sequence = currentShoe.id.slice(-4); // Lấy "0005"
      const newId = `${prefix}${brandCode}${sequence}`; // Tạo id mới

      // Chuẩn bị dữ liệu cập nhật
      const updatedData = {
          id: newId, // Cập nhật id mới
          name,
          type,
          sizes: sizes.split(',').map(Number),
          color,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
      };

      // Nếu có hình ảnh mới, cập nhật URL từ Cloudinary
      if (req.file) {
          updatedData.image = req.file.path;
      }

      // Cập nhật sản phẩm trong cơ sở dữ liệu
      const updatedShoe = await Shoe.findByIdAndUpdate(req.params.id, updatedData, { new: true });

      res.json(updatedShoe);
  } catch (error) {
      console.error('Error updating shoe:', error);
      res.status(500).json({ message: 'Failed to update shoe.' });
  }
});
router.delete('/:id', async (req, res) => {
    try {
        const shoeId = req.params.id;
        const shoe = await Shoe.findByIdAndDelete(shoeId);

        //Xóa hình ảnh trên Cloudinary
        if (shoe.image) {
            const publicId = shoe.image.split('/').pop().split('.')[0]; // Lấy public_id từ URL
            await cloudinary.uploader.destroy(publicId); // Xóa hình ảnh trên Cloudinary
        }
        const deletedShoe = await Shoe.findByIdAndDelete(shoeId);
        res.json({ message: 'Shoe deleted successfully!', shoe: deletedShoe });
    } catch (error) {
        console.error('Error deleting shoe:', error);
        res.status(500).json({ message: 'Failed to delete shoe.' });
    }
})

module.exports = router;