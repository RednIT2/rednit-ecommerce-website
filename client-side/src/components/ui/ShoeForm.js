import React from "react";
import { Form, Button } from "react-bootstrap";

export function ShoeForm({ values, errors, onChange, onBlur, onImageChange, onSubmit, generatedId }) {
    return (
        <Form className="p-4 bg-white rounded-lg shadow-md">
            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Generated ID</Form.Label>
                <Form.Control 
                    type="text" 
                    value={generatedId} 
                    readOnly 
                    className="border border-gray-300 rounded-md"
                />
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Name</Form.Label>
                <Form.Control 
                    type="text" 
                    value={values.name} 
                    onChange={onChange("name")}
                    onBlur={onBlur("name")}
                    placeholder="Enter shoe name..." 
                    isInvalid={!!errors.name}
                    className="border border-gray-300 rounded-md"
                />
                <Form.Control.Feedback type="invalid" className="text-red-500">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Type</Form.Label>
                <Form.Select 
                    value={values.type} 
                    onChange={onChange("type")}
                    className="border border-gray-300 rounded-md"
                >
                    <option value="">-- Select type --</option>
                    <option value="Others">Others</option>
                    <option value="Puma">Puma</option>
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Price</Form.Label>
                <Form.Control 
                    type="number" 
                    value={values.price} 
                    onChange={onChange("price")}
                    onBlur={onBlur("price")}
                    placeholder="Enter price..." 
                    isInvalid={!!errors.price}
                    className="border border-gray-300 rounded-md"
                />
                <Form.Control.Feedback type="invalid" className="text-red-500">{errors.price}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Color</Form.Label>
                <Form.Control
                    type="text"
                    value={values.color}
                    onChange={onChange("color")}
                    onBlur={onBlur("color")}
                    placeholder="Enter color..."
                    isInvalid={!!errors.color}
                    className="border border-gray-300 rounded-md"
                />
                <Form.Control.Feedback type="invalid" className="text-red-500">{errors.color}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Sizes (comma separated)</Form.Label>
                <Form.Control
                    type="text"
                    value={values.sizes}
                    onChange={onChange("sizes")}
                    onBlur={onBlur("sizes")}
                    placeholder="Enter sizes..."
                    isInvalid={!!errors.sizes}
                    className="border border-gray-300 rounded-md"
                />
                <Form.Control.Feedback type="invalid" className="text-red-500">{errors.sizes}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Stock</Form.Label>
                <Form.Control
                    type="text"
                    value={values.stock}
                    onChange={onChange("stock")}
                    onBlur={onBlur("stock")}
                    placeholder="Enter stock..."
                    isInvalid={!!errors.stock}
                    className="border border-gray-300 rounded-md"
                />
                <Form.Control.Feedback type="invalid" className="text-red-500">{errors.stock}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label className="font-semibold">Image</Form.Label>
                <Form.Control 
                    type="file" 
                    onChange={onImageChange}
                    onBlur={onBlur("image")}
                    isInvalid={!!errors.image}
                    className="border border-gray-300 rounded-md"
                />
                <Form.Control.Feedback type="invalid" className="text-red-500">{errors.image}</Form.Control.Feedback>
            </Form.Group>

            {values.image && (
                <img
                    src={URL.createObjectURL(values.image)}
                    alt="Preview"
                    className="img-thumbnail mb-3 w-full rounded-md shadow-md"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                />
            )}

            <Button 
                variant="success" 
                onClick={onSubmit} 
                className="w-full py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
            >
                Add Product
            </Button>
        </Form>
    );
}