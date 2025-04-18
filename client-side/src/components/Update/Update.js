import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

export function Update({ shoe, onSave }) {
  const [updatedShoe, setUpdatedShoe] = useState({ ...shoe });
  const [newImage, setNewImage] = useState(null); // State để lưu hình ảnh mới

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedShoe({ ...updatedShoe, [name]: value });
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
  
    if (newImage) {
      formData.append("image", newImage); // Thêm hình ảnh mới nếu có
    } else {
      formData.append("image", updatedShoe.image); // Giữ hình ảnh cũ nếu không có hình ảnh mới
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
          type="text"
          name="type"
          value={updatedShoe.type}
          onChange={handleChange}
          placeholder="Enter product type"
        />
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