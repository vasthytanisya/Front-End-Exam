import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { Page } from '@/types/Page'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {z} from 'zod';
import Link from 'next/link';
import { BackEndClient } from '@/functions/swagger/NextJsBackEnd';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const IndexPage: Page = () => {

    const {register, handleSubmit, formState:{errors}, reset} = useForm<FormDataType>({
        resolver: zodResolver(FormSchema)
    });
   
    async function onSubmit(data: FormDataType){
        console.log(data);

        try{
            const client = new BackEndClient('http://localhost:3000/api/be');
            await client.createRestaurant({
                name: data.name
            })
            reset();
        }catch(error){
            console.error(error);
        }
    }

    return (
        <div>
            <Title>Manage Restaurant</Title>
            <Link href='/restaurant'>Return to index</Link>
            <h2 className='mb-5 text-3xl'>Create Restaurant</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Restaurant Name</label>
                    <input {...register('name')} id='name' className='w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'></input>
                    <p className='mt-2 text-red-500'>{errors['name']?.message}</p>
                </div>
                <div>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>Submit</button>
                </div>
            </form>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;