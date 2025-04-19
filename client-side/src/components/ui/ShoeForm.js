import React from "react";
import { Form, Button } from "react-bootstrap";

export function ShoeForm({ values, errors, onChange, onBlur, onImageChange, onSubmit, generatedId }) {
    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Generated ID</Form.Label>
                <Form.Control type="text" value={generatedId} readOnly />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control 
                    type="text" 
                    value={values.name} 
                    onChange={onChange("name")}
                    onBlur={onBlur("name")}
                    placeholder="Enter shoe name..." 
                    isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select value={values.type} onChange={onChange("type")}>
                    <option value="">-- Select type --</option>
                    <option value="Others">Others</option>
                    <option value="Puma">Puma</option>
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control 
                    type="number" 
                    value={values.price} 
                    onChange={onChange("price")}
                    onBlur={onBlur("price")}
                    placeholder="Enter price..." 
                    isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Color</Form.Label>
                <Form.Control
                    type="text"
                    value={values.color}
                    onChange={onChange("color")}
                    onBlur={onBlur("color")}
                    placeholder="Enter color..."
                    isInvalid={!!errors.color}
                />
                <Form.Control.Feedback type="invalid">{errors.color}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Sizes (comma separated)</Form.Label>
                <Form.Control
                    type="text"
                    value={values.sizes}
                    onChange={onChange("sizes")}
                    onBlur={onBlur("sizes")}
                    placeholder="Enter sizes..."
                    isInvalid={!!errors.sizes}
                />
                <Form.Control.Feedback type="invalid">{errors.sizes}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                    type="text"
                    value={values.stock}
                    onChange={onChange("stock")}
                    onBlur={onBlur("stock")}
                    placeholder="Enter stock..."
                    isInvalid={!!errors.stock}
                />
                <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control 
                    type="file" 
                    onChange={onImageChange}
                    onBlur={onBlur("image")}
                    isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
            </Form.Group>

            {values.image && (
                <img
                    src={URL.createObjectURL(values.image)}
                    alt="Preview"
                    className="img-thumbnail mb-3 w-full rounded-md shadow-md"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                />
            )}

            <Button variant="success" onClick={onSubmit}>Save</Button>
        </Form>
    );
}