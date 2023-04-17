import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { FoodItemDetailModel } from '@/functions/swagger/NextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page'; 
import { Alert } from 'antd';
import Link from 'next/link';
import useSwr from 'swr';

const FoodItemTableRow: React.FC<{
    foodItem: FoodItemDetailModel
}> = ({foodItem}) => {

    return(
        <tr>
            <td className="border px-4 py-2">{foodItem.id}</td>
            <td className="border px-4 py-2">{foodItem.name}</td>
            <td className="border px-4 py-2">{foodItem.price}</td>
            <td>
                <Link href={`/add-to-cart/${foodItem.id}`} className='inline-block py-1 px-2 text-xs bg-blue-500 text-white rounded-lg' type='button'>
                    Add to Cart
                </Link>
                <Link href={`/order-summary/${foodItem.restaurandId}`} className='ml-1 py-1 px-2 text-xs bg-blue-500 text-white rounded-lg' type='button'>
                    CheckOut
                </Link>
            </td>
        </tr>
    );
};

const IndexPage: Page = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error } = useSwr<FoodItemDetailModel[]>('/api/be/api/Fooditems', swrFetcher);
   
    return (
        <div>
            <Title>Menu Food Item</Title>
            <Link href='/'>Return Back</Link>
            {Boolean(error) && <Alert type='error' message='cannot get food item data' description={error}></Alert>}
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
                    {data?.map((x, i) => <FoodItemTableRow key={i} foodItem={x}></FoodItemTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;