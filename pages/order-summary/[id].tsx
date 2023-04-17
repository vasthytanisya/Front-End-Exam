import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { Authorize } from '@/components/Authorize';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import useSwr from 'swr';
import { CartDetailModel} from '@/functions/swagger/NextJsBackEnd';
import Link from 'next/link';

const CartDisplayItem: React.FC<{
    cart: CartDetailModel
}> = ({ cart }) => {

    return (
        <tr>
            <td className="border px-4 py-2">{cart.id}</td>
            <td className="border px-4 py-2">{cart.foodItemsId}</td>
            <td className="border px-4 py-2">{'Rp.' + cart.foodItemsPrice?.toLocaleString()}</td>
            <td className="border px-4 py-2">{cart.qty}</td>
        </tr>

    );
};

const InnerIndexPage: React.FC = () => {
    const fetcher = useSwrFetcherWithAccessToken();
    const { data } = useSwr<CartDetailModel[]>('/api/be/api/CartDetails', fetcher);

    return (
        <div>
            <Title>Order Summary</Title>
            <Link href='/'>Return Back</Link>
            <table className='table-auto mt-5'>
                <thead className='bg-slate-700 text-white'>
                    <tr>
                        <th className='px-4 py-2'>ID</th>
                        <th className='px-4 py-2'>Name</th>
                        <th className='px-4 py-2'>Price</th>
                        <th className='px-4 py-2'>Qty</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((x, i) => <CartDisplayItem key={i} cart={x} />)}
                </tbody>
                <tfoot className='bg-slate-700 text-white'>
                    <tr>
                        <td className='px-4 py-2'>Total Price</td>
                        <td className='px-4 py-2'></td>
                    </tr>
                    <tr>
                        <Link href='/order-finished'>
                            Order
                        </Link>
                    </tr>
                </tfoot>
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