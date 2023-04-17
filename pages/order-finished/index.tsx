import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page';
import { Authorize } from '@/components/Authorize';
import Link from 'next/link';

const IndexPage: Page = () => {
    return (
        <Authorize>
            <div>
                <Title>Order Finished</Title>
                <Link href='/'>Thank you</Link>
            </div>
        </Authorize>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;