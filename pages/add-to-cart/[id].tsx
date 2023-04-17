import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { Authorize } from '@/components/Authorize';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSwr from 'swr';
import { BackEndClient, FoodItemDataGridItem } from '@/functions/swagger/NextJsBackEnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { notification } from 'antd';
import { useAuthorizationContext } from '@/functions/AuthorizationContext';
import Link from 'next/link';

const CartDisplayItem: React.FC<{
    foodItem: FoodItemDataGridItem
}> = ({ foodItem }) => {

    const [qty, setQty] = useState(1);

    const { accessToken } = useAuthorizationContext();

    async function addToCart() {
        const client = new BackEndClient('http://localhost:3000/api/be', {
            fetch(url, init) {
                if (init && init.headers){
                    init.headers['Authorization'] = `Bearer ${accessToken}`
                }
                return fetch(url, init);
            }
        });
        try {
            await client.addToCart({
                foodItemsId: foodItem.id,
                qty: qty
            });
            notification.success({
                type: 'success',
                placement: 'bottomRight',
                message: 'Added to cart',
                description: `Added ${qty} ${foodItem.name} to cart`
            });
        } catch (err) {
            notification.error({
                type: 'error',
                placement: 'bottomRight',
                message: 'Failed to add to cart',
                description: String(err)
            });
        }
    }

    return (
        <tr>
            <td className="border px-4 py-2">{foodItem.id}</td>
            <td className="border px-4 py-2">{foodItem.name}</td>
            <td className="border px-4 py-2">{'Rp.' + foodItem.price?.toLocaleString()}</td>
            <td>
                <button onClick={() => setQty((q) => q + 1)} className='inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg' type='button'>
                    <FontAwesomeIcon icon={faCartPlus} className='mr-3'></FontAwesomeIcon>
                </button>
                <button onClick={() => setQty((q) => q - 1)} className=' py-1 px-2 text-xs bg-blue-500 text-white rounded-lg' type='button'>
                    <FontAwesomeIcon icon={faMinus} className='mr-3'></FontAwesomeIcon>
                </button>
            </td>
            <td>
                <button onClick={addToCart} className='block w-full p-1 text-sm rounded-md bg-blue-500 active:bg-blue-700 text-white' type='button'>
                    <FontAwesomeIcon icon={faCartPlus} className='mr-3'></FontAwesomeIcon>
                    Add To Cart
                </button>
            </td>
        </tr>

    );
};

const InnerIndexPage: React.FC = () => {
    const fetcher = useSwrFetcherWithAccessToken();
    const { data } = useSwr<FoodItemDataGridItem[]>('/api/be/api/FoodItems', fetcher);

    return (
        <div>
            <Title>Add Cart</Title>
            <Link href='/'>Return Back</Link>
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Price</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <CartDisplayItem key={i} foodItem={x} />)}
                </tbody>
            </table>
        </div>
    );
}

const IndexPage: Page = () => {
    return (
        <Authorize>
            <InnerIndexPage></InnerIndexPage>
        </Authorize>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;