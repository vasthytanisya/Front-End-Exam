import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Restaurant } from '@/functions/swagger/NextJsBackEnd';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import { Page } from '@/types/Page'; 
import { Alert} from 'antd';
import Link from 'next/link';
import useSwr from 'swr';

const RestaurantTableRow: React.FC<{
    restaurant: Restaurant
}> = ({restaurant}) => {

    return(
        <tr>
            <td className="border px-4 py-2">{restaurant.name}</td>
            <td className="border px-4 py-2">
                <Link href={`/restaurant/${restaurant.id}`} className="mr-2 py-1 px-2 text-xs bg-blue-500 text-white rounded-lg">
                    See Restaurant
                </Link>
            </td>
        </tr>
    );
};

const IndexPage: Page = () => {
    const swrFetcher = useSwrFetcherWithAccessToken();
    const { data, error} = useSwr<Restaurant[]>('/api/be/api/Restaurants', swrFetcher);
   
    return (
        <div>
            <Title>Restaurant</Title>
            
            {Boolean(error) && <Alert type='error' message='cannot get restaurant data' description={error}></Alert>}
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>Name</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <RestaurantTableRow key={i} restaurant={x} ></RestaurantTableRow>)}
                </tbody>
            </table>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;