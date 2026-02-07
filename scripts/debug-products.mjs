
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
    console.log('Testing featured products query...');
    const { data, error } = await supabase
        .from('products')
        .select(`
      id, 
      name, 
      featured, 
      active,
      image,
      category:categories(id, name, slug)
    `)
        .eq('active', true)
        .limit(5);

    if (error) {
        console.error('Error fetching products:', error);
    } else {
        console.log(`Found ${data.length} products`);
        if (data.length > 0) {
            console.log('Sample product:', data[0]);
        }
    }

    console.log('\nTesting product_images relationship...');
    const { data: imagesData, error: imagesError } = await supabase
        .from('products')
        .select(`
      id,
      product_images(image_url:url)
    `)
        .limit(1);

    if (imagesError) {
        console.error('Error fetching product_images relationship:', imagesError);
    } else {
        console.log('Product images relationship query success');
        const firstImage = imagesData[0]?.product_images?.[0];
        if (firstImage) {
            console.log('Keys:', Object.keys(firstImage));
        } else {
            console.log('No images found for this product');
        }
    }
}

testQuery();
