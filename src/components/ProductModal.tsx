import React, { useState, useEffect } from 'react';
import { useApp, Product } from '../contexts/AppContext';
import { useSettings } from '../contexts/SettingsContext';

type ProductModalProps = {
  product?: Product | null;
  onClose: () => void;
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useApp();
  const { productSettings } = useSettings();

  // Estados locais do formulário
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [unit, setUnit] = useState('');
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [supplier, setSupplier] = useState('');
  const [components, setComponents] = useState<
    { product_name: string; quantity: number; unit: string; total_cost: number }[]
  >([]);

  // Carregar dados no caso de edição
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setType(product.type);
      setUnit(product.unit);
      setCurrentStock(product.current_stock);
      setMinStock(product.min_stock);
      setCostPrice(product.cost_price);
      setSalePrice(product.sale_price || '');
      setSupplier(product.supplier || '');
      setComponents(product.components || []);
    } else {
      setName('');
      setDescription('');
      setCategory('');
      setType('');
      setUnit('');
      setCurrentStock(0);
      setMinStock(0);
      setCostPrice(0);
      setSalePrice('');
      setSupplier('');
      setComponents([]);
    }
  }, [product]);

  // Adicionar componente
  const addComponent = () => {
    setComponents([...components, { product_name: '', quantity: 1, unit: '', total_cost: 0 }]);
  };

  // Atualizar componente
  const updateComponent = (index: number, field: string, value: any) => {
    const updated = [...components];
    (updated[index] as any)[field] = value;
    setComponents(updated);
  };

  // Remover componente
  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  // Salvar produto
  const handleSubmit = () => {
    const newProduct: Product = {
      id: product?.id || Date.now().toString(),
      name,
      description,
      category,
      type,
      unit,
      current_stock: currentStock,
      min_stock: minStock,
      cost_price: costPrice,
      sale_price: salePrice ? Number(salePrice) : undefined,
      supplier: supplier || undefined,
      components,
    };

    if (product) {
      updateProduct(newProduct);
    } else {
      addProduct(newProduct);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">
          {product ? 'Editar Produto' : 'Novo Produto'}
        </h2>

        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do produto"
            className="w-full border rounded p-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
            className="w-full border rounded p-2"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Selecione uma categoria</option>
            {productSettings.categories.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={type}
            onChange={e => setType(e.target.value as "material_bruto" | "parte_produto" | "produto_pronto")}
            className="w-full border rounded p-2"
          >
            <option value="">Selecione o tipo</option>
            <option value="material_bruto">Material Bruto</option>
            <option value="parte_produto">Parte de Produto</option>
            <option value="produto_pronto">Produto Pronto</option>
          </select>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Unidade (ex: kg, un, m)"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(Number(e.target.value))}
            placeholder="Estoque atual"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            value={minStock}
            onChange={(e) => setMinStock(Number(e.target.value))}
            placeholder="Estoque mínimo"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(Number(e.target.value))}
            placeholder="Preço de custo"
            className="w-full border rounded p-2"
          />
          <input
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(Number(e.target.value))}
            placeholder="Preço de venda (opcional)"
            className="w-full border rounded p-2"
          />
          <input
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Fornecedor (opcional)"
            className="w-full border rounded p-2"
          />

          {/* Componentes */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Componentes</span>
              <button
                onClick={addComponent}
                type="button"
                className="text-sm px-2 py-1 bg-blue-600 text-white rounded"
              >
                + Adicionar
              </button>
            </div>
            <div className="space-y-2">
              {components.map((comp, index) => (
                <div key={index} className="grid grid-cols-4 gap-2 items-center">
                  <input
                    value={comp.product_name}
                    onChange={(e) => updateComponent(index, 'product_name', e.target.value)}
                    placeholder="Produto"
                    className="border rounded p-1"
                  />
                  <input
                    type="number"
                    value={comp.quantity}
                    onChange={(e) => updateComponent(index, 'quantity', Number(e.target.value))}
                    placeholder="Qtd"
                    className="border rounded p-1"
                  />
                  <input
                    value={comp.unit}
                    onChange={(e) => updateComponent(index, 'unit', e.target.value)}
                    placeholder="Un"
                    className="border rounded p-1"
                  />
                  <input
                    type="number"
                    value={comp.total_cost}
                    onChange={(e) => updateComponent(index, 'total_cost', Number(e.target.value))}
                    placeholder="Custo"
                    className="border rounded p-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeComponent(index)}
                    className="text-xs text-red-600"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;