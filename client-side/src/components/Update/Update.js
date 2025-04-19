import React, { useState, useEffect } from "react";
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

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("id", updatedShoe.id); // Gửi id mới
    formData.append("type", updatedShoe.type);
    formData.append("name", updatedShoe.name);
    formData.append("sizes", updatedShoe.sizes.join(","));
    formData.append("color", updatedShoe.color);
    formData.append("price", updatedShoe.price);
    formData.append("stock", updatedShoe.stock);

    if (newImage) {
        formData.append("image", newImage); // Thêm hình ảnh mới nếu có
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/shoes/${updatedShoe._id}`, {
            method: "PUT",
            body: formData,
        });

        if (response.ok) {
            const updatedShoeData = await response.json();
            onSave(updatedShoeData); // Gọi callback để cập nhật danh sách sản phẩ
        } else {
            console.error("Failed to update shoe:", await response.json());
        }
    } catch (error) {
        console.error("Error updating shoe:", error);
    }
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
          <option value="">Select Type</option>
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
  //gcvh
}