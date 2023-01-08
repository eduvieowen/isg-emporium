import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const params = {
                submit_type: 'pay',
                mode: 'payment',
                payment_method_types: ['card'],
                billing_address_collection: 'auto',
                shipping_options: [
                    // change usd rates, to ngn
                    { shipping_rate: 'shr_1MNMhXCaJJtIhnPyxQptI2pE'}, // free
                    { shipping_rate: 'shr_1MNfuPCaJJtIhnPyqFsfLYum'}, // fast
                ],
                line_items: req.body.map((item) => {

                    const img = item.image[0].asset._ref;
                    const newImage = img.replace('image-','https://cdn.sanity.io/images/vvq994fd/production/').replace('-jpeg', '.jpeg').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp');

                    // console.log('IMAGE', newImage);

                    return {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: item.name,
                                images: [newImage],
                            },
                            unit_amount: item.price * 100
                        },
                        adjustable_quantity: {
                            enabled: true,
                            minimum: 1,
                        },
                        quantity: item.quantity,
                    }
                    
                }),
                success_url: `${req.headers.origin}/success`,
                cancel_url: `${req.headers.origin}/canceled`, // change redirect to product page
            };
            // Create Checkout Sessions from body params.
            const session = await stripe.checkout.sessions.create(params);
            // res.redirect(303, session.url);
            res.status(200).json(session);

        } catch (err) {
            res.status(err.statusCode || 500).json(err.message);
        }

    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}