import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export function Update({ shoe, onSave }) {
    const [updatedShoe, setUpdatedShoe] = useState({ ...shoe });
    const [newImage, setNewImage] = useState(null); // State để lưu hình ảnh mới

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Nếu thay đổi type, cập nhật lại id
        if (name === "type") {
            const brandCode =
                value === "Puma" ? "PM" :
                value === "Nike" ? "NK" :
                value === "Adidas" ? "AD" : "XX";

        const sequence = updatedShoe.id.slice(-4); // Lấy 4 ký tự cuối từ id hiện tại
        const newId = `SHOE${brandCode}${sequence}`; // Tạo id mới

            setUpdatedShoe({ ...updatedShoe, [name]: value, id: newId });
        } else {
            setUpdatedShoe({ ...updatedShoe, [name]: value });
        }
    };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file); // Lưu file ảnh mới
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", updatedShoe.name);
    formData.append("type", updatedShoe.type);
    formData.append("sizes", updatedShoe.sizes.join(","));
    formData.append("color", updatedShoe.color);
    formData.append("price", updatedShoe.price);
    formData.append("stock", updatedShoe.stock);
    formData.append("id", updatedShoe.id); // Gửi id mới

    if (newImage) {
      formData.append("image", newImage); // Thêm hình ảnh mới nếu có
    }

    onSave(updatedShoe._id, formData); // Gửi formData thay vì object thông thường
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={updatedShoe.name}
          onChange={handleChange}
          placeholder="Enter product name"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Type</Form.Label>
        <Form.Control
          as="select"
          name="type"
          value={updatedShoe.type}
          onChange={handleChange}
        >
          <option value="Puma">Puma</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
          <option value="Others">Others</option>
        </Form.Control>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Sizes (comma-separated)</Form.Label>
        <Form.Control
          type="text"
          name="sizes"
          value={updatedShoe.sizes.join(", ")} // Hiển thị dưới dạng chuỗi
          onChange={(e) =>
            setUpdatedShoe({
              ...updatedShoe,
              sizes: e.target.value.split(",").map((size) => size.trim()), // Chuyển đổi lại thành mảng
            })
          }
          placeholder="Enter sizes (e.g., 38, 39, 40)"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Color</Form.Label>
        <Form.Control
          type="text"
          name="color"
          value={updatedShoe.color}
          onChange={handleChange}
          placeholder="Enter product color"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={updatedShoe.price}
          onChange={handleChange}
          placeholder="Enter product price"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Stock</Form.Label>
        <Form.Control
          type="number"
          name="stock"
          value={updatedShoe.stock}
          onChange={handleChange}
          placeholder="Enter product stock"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image</Form.Label>
        <Form.Control type="file" onChange={handleImageChange} />
        {newImage && (
          <img
            src={URL.createObjectURL(newImage)}
            alt="Preview"
            className="img-thumbnail mt-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
        )}
      </Form.Group>
      <Button variant="success" onClick={handleSave}>
        Save
      </Button>
    </Form>
  );
}