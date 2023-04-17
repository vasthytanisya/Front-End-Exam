import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { FoodItemDataGridItem } from '@/functions/swagger/NextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page'; 
import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from 'antd';
import Link from 'next/link';
import useSwr from 'swr';

const FoodItemTableRow: React.FC<{
    foodItem: FoodItemDataGridItem
}> = ({foodItem}) => {

    return(
        <tr>
            <td className="border px-4 py-2">{foodItem.id}</td>
            <td className="border px-4 py-2">{foodItem.name}</td>
            <td className="border px-4 py-2">{foodItem.price}</td>
            <td className="border px-4 py-2">{foodItem.restaurantName}</td>
        </tr>
    );
};

const IndexPage: Page = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error } = useSwr<FoodItemDataGridItem[]>('/api/be/api/Fooditems', swrFetcher);
   
    return (
        <div>
            <Title>Manage Food Items</Title>
            <div>
                <Link href='/foodItem/create' className='mb-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    <FontAwesomeIcon className='mr-1' icon={faPlus}></FontAwesomeIcon>
                    Create New Food items
                </Link>
            </div>
            
            {Boolean(error) && <Alert type='error' message='cannot get food item data' description={error}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Price</th>
                        <th className='px-4 py-2'>Restaurant Name</th>
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