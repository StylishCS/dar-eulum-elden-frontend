import { useState } from 'react';
import { Card, Typography, Button } from "@material-tailwind/react";
import http from '../http';

const TABLE_HEAD = ["Item", "Description", "Quantity", ""];

export function EditInvoiceTable({ invoice }) {
  const [products, setProducts] = useState(invoice.products || []);
  const [actions, setActions] = useState([]);

  const handleQuantityChange = (index, delta) => {
    const newProducts = [...products];
    newProducts[index].quantity += delta;

    if (newProducts[index].quantity < 0) newProducts[index].quantity = 0;

    setProducts(newProducts);
    setActions([...actions, { type: 'quantity', index, delta }]);
  };

  const handleDelete = (index) => {
    const newProducts = [...products];
    newProducts[index].deleted = true; // Mark as deleted
    setProducts(newProducts);
    setActions([...actions, { type: 'delete', index }]);
  };

  const undoAction = () => {
    const lastAction = actions.pop();
    if (!lastAction) return; // No action to undo

    const { type, index } = lastAction;
    if (type === 'quantity') {
      // Undo quantity change
      const newProducts = [...products];
      newProducts[index].quantity -= lastAction.delta;
      if (newProducts[index].quantity < 0) newProducts[index].quantity = 0;
      setProducts(newProducts);
    } else if (type === 'delete') {
      // Undo deletion
      const newProducts = [...products];
      newProducts[index].deleted = false; // Unmark as deleted
      setProducts(newProducts);
    }

    // Remove last action from actions
    setActions([...actions]);
  };

  const isRowChanged = (index) => {
    return actions.some(action => action.index === index);
  };

  const isDeletedRow = (index) => {
    return products[index].deleted;
  };

  const handleSubmit = () => {
    const res = http.PATCH(`/dashboard/invoices/${invoice._id}`, {actions});
    if(res){
        location.reload();
    }
  }

  return (
    <>
    <Card className="w-full overflow-scroll">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(({ name, authors, quantity, category, manufacture, deleted }, index) => {
            const rowClass = deleted ? "bg-red-200" : (isRowChanged(index) ? "bg-yellow-200" : (index % 2 === 0 ? "even:bg-blue-gray-50/50" : ""));

            return (
              <tr key={index} className={rowClass}>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal">
                    {category} | {manufacture} | {authors?.join(", ")}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography variant="small" color="blue-gray" className="font-normal flex gap-2">
                    <Button onClick={() => handleQuantityChange(index, -1)} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700">-</Button>
                    {quantity}
                    <Button onClick={() => handleQuantityChange(index, 1)} className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border focus:outline-none focus:ring-2 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700">+</Button>
                  </Typography>
                </td>
                <td className="p-4">
                  {!deleted && (
                    <Typography as="button" variant="small" color="blue-gray" className="font-medium text-red-600" onClick={() => handleDelete(index)}>
                      Delete
                    </Typography>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button onClick={undoAction} className="my-4 bg-gray-700 hover:bg-gray-600 focus:ring-gray-700 mx-auto w-50">
        Undo
      </Button>
    </Card>
    <div className='w-72 mx-auto mt-4'>
        <Button color='light-blue' className='w-full' onClick={handleSubmit}>Update</Button>
    </div>
    </>
  );
}
