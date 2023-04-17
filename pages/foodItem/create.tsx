import { WithDefaultLayout } from '@/components/DefautLayout';
import { Title } from '@/components/Title';
import { BackEndClient, Restaurant } from '@/functions/swagger/NextJsBackEnd';
import { Page } from '@/types/Page'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {z} from 'zod';
import Link from 'next/link';
import { Select, Spin } from 'antd';
import { useState } from 'react';
import useSwr from 'swr';
import { useSwrFetcherWithAccessToken } from '@/functions/useSwrFetcherWithAccessToken';
import debounce from 'lodash.debounce';

const FormSchema = z.object({
    name: z.string().nonempty({
        message: 'Nama tidak boleh kosong'
    }),
    price: z.number({
        invalid_type_error: 'Harga tidak boleh kosong'
    }).positive().min(1000, {
        message: 'Harga harus lebih dari 1000'
    }).max(100000000, {
        message: 'Harga tidak boleh lebih dari 100000000'
    }),
    restaurantId: z.string({
        required_error: 'Restaurant tidak boleh kosong'
    }).nonempty({
        message: 'Restauran tidak boleh kosong'
    })
});

type FormDataType = z.infer<typeof FormSchema>;

const IndexPage: Page = () => {

    const {
        register, 
        handleSubmit, 
        formState:{errors}, 
        reset, 
        control} = useForm<FormDataType>({
        resolver: zodResolver(FormSchema)
    });
   
    async function onSubmit(data: FormDataType){

        try{
            const client = new BackEndClient('http://localhost:3000/api/be');
            await client.createFoodItem({
                name: data.name,
                price: data.price,
                restaurantId: data.restaurantId
            })
            reset();
        }catch(error){
            console.error(error);
        }
    }

    const [search, setSearch] = useState('');
    const params = new URLSearchParams();
    params.append('search', search);
    const restaurantUri = '/api/be/api/Restaurants?' + params.toString();
    const fetcher = useSwrFetcherWithAccessToken();
    const {data, isLoading, isValidating} = useSwr<Restaurant[]>(restaurantUri, fetcher);


    const setSearchDebounced = debounce((t: string) => setSearch(t), 300);

    const options = data?.map(Q => {
        return {
            label: Q.name,
            value: Q.id
        };
    }) ?? [];

    return (
        <div>
            <Title>Manage Food Item</Title>
            <Link href='/foodItem'>Return to index</Link>
           
            <h2 className='mb-5 text-3xl'>Create Food Item</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor='name'>Name Food</label>
                    <input {...register('name')} id='name' className='w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'></input>
                    <p className='mt-2 text-red-500'>{errors['name']?.message}</p>
                </div>
                <div>
                    <label htmlFor='price'>Price</label>
                    <input {...register('price', { valueAsNumber: true })} id='price' className='w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' type='number'></input>
                    <p className='mt-2 text-red-500'>{errors['price']?.message}</p>
                </div>
                <div className='mt-5'>
                    <label htmlFor='restaurant'>Restaurant Name</label>
                    <Controller
                        control = {control}
                        name='restaurantId'
                        render={({field}) => (
                            <Select
                                className='block'
                                showSearch
                                optionFilterProp='children'
                                {...field}
                                onSearch={t => setSearchDebounced(t)}
                                options={options}
                                filterOption={false}
                                notFoundContent={(isLoading || isValidating)? <Spin size='small'/> : null}
                            />
                        )}
                    ></Controller>
                    
                    <p className='mt-2 text-red-500'>{errors['restaurantId']?.message}</p>
                </div>
                <div className='mt-5'>
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>Submit</button>
                </div>
            </form>
        </div>
    );
}

IndexPage.layout = WithDefaultLayout;
export default IndexPage;