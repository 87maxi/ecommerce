#!/usr/bin/env bash
set -euo pipefail

ROOT=$PWD

RPC_URL="http://127.0.0.1:8545"
DEPLOYER_PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"


STRIPE_SK=$(echo "U1RSSVBFX1NFQ1JFVF9LRVk9c2tfdGVzdF81MVNXd2pJMk1JYkw0UG9GRk5pVDUyVDJzenZTU1pSa0xYbUcwODZvQjBwS0FxZkZsd2U0a3Fhc2loSmMwZFBOUkFMbFdrR2pmak90bkk2dWtXNWR6aTZoSTAwNktjSzFyQVMK" | base64 --decode);
STRIPE_PK=$(echo "TkVYVF9QVUJMSUNfU1RSSVBFX1BVQkxJU0hBQkxFX0tFWT1wa190ZXN0XzUxU1d3akkyTUliTDRQb0ZGR2haZHJEMjlEVElpWDFUSmRuM0hURndXV21ZNEVaZmtuY3lwZ253MG15dTN2Z2hvWVNGd1JuQlU4d2NFWHBlYkpUVW9sQmJvMDBGVEZ2VTVWawo=" | base64 --decode)



rm -rf sc-ecommerce/cache/* 


cd $ROOT/sc-ecommerce;


echo "Running deployment Ecommerce script..."

DEPLOY_ECOMMERCE=$(forge script script/DeployEcommerce.s.sol  --rpc-url $RPC_URL --private-key $DEPLOYER_PRIVATE_KEY  --broadcast || exit 1);

if [ $? -eq 0 ]; then
    echo "Ecommerce deployed successfully.";
else
    echo "Ecommerce deployment failed.";
    exit 1;
fi

echo "Deployment script completed.";

CONTRACT_ADDRESS=$(jq -r  '.transactions[]   .contractAddress' ./broadcast/*/31337/run-latest.json )


ECOMMERCE_ABI_JSON=$(forge inspect "Ecommerce" abi --json);

#echo $ECOMMERCE_ABI_JSON | jq '.';



cd $ROOT/web-customer;

echo $ECOMMERCE_ABI_JSON | jq '.' > src/contracts/abis/EcommerceABI.json ;

cd $ROOT/web-admin;

echo $ECOMMERCE_ABI_JSON | jq '.' > src/contracts/abis/EcommerceABI.json ;




# Deploy EuroToken (stablecoin) contract


STABLECOIN_PATH=$ROOT/stablecoin;

cd $STABLECOIN_PATH/sc;

rm -rf cache/*

DEPLOY_STABLECOIN=$(forge script script/DeployEuroToken.s.sol  --rpc-url $RPC_URL --private-key $DEPLOYER_PRIVATE_KEY  --broadcast );


if [ $? -eq 0 ]; then
    echo "EuroToken deployed successfully.";
else
    echo "EuroToken deployment failed.";
    exit 1;
fi

STABLECOIN_ABI_JSON=$(forge inspect "EuroToken" abi --json);

STABLECOIN_ADDRESS=$(jq -r  '.transactions[]   .contractAddress' ./broadcast/*/31337/run-latest.json )



echo $STABLECOIN_ABI_JSON;

cd $STABLECOIN_PATH/compra-stablecoin;

rm -rf .env;

echo $STABLECOIN_ABI_JSON | jq '.' > src/contracts/abis/StableCoinABI.json ;



cat > .env << EOF
$STRIPE_SK
$STRIPE_PK
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
OWNER_PRIVATE_KEY=0x...
NEXT_PUBLIC_SITE_URL=http://localhost:3033
NEXT_PUBLIC_NETWORK_NAME=anvil
NODE_ENV=development
NEXT_PUBLIC_PASARELA_PAGO_URL=http://localhost:3002
EOF


cd $STABLECOIN_PATH/pasarela-de-pago;



echo $STABLECOIN_ABI_JSON | jq '.' > src/contracts/abis/StableCoinABI.json ;


rm -rf .env



cat > .env << EOF
$STRIPE_PK
$STRIPE_SK
TURSO_DATABASE_URL=http://localhost:3032
NEXT_PUBLIC_EUROTOKEN_CONTRACT_ADDRESS=$STABLECOIN_ADDRESS
turso_AUTH_TOKEN=abc123NEXT_PUBLIC_COMPRAS_STABLEBOIN_URL=http://localhost:3033
EOF