# Tangle app for Zendesk

This app allows you to connect your Tangle account to your Zendesk instance and view all your customer emails stored on Tangle, next to your Zendesk tickets.

The purpose of this repository is for the Zendesk team to review the app versions before they go live on the Zendesk Marketplace.

If you're not from the Zendesk team, you'll have much more fun using the app by simply installing it [from the marketplace](https://www.zendesk.com/marketplace/apps/support/1065910/tangle).


## Setup

```
bun install
```
By default, you will see fake data in the app that always returns *something* for any Zendesk ticket, unless you use your own API key that you can [get on Tangle](https://tangle.soy?ref=gh).


## Running locally

### Development environment
*Note: when running the development version locally, the app will not use Zendesk Proxy, as it doesn't support secure parameters when running locally. Instead, it will send requests directly to the Tangle API.*

1. Open a new terminal and run the command:

```
bun run dev
```

2. In another terminal run:

```
bun run start
```

3. Open your browser and go to your Zendesk instance `https://<your-subdomain>.zendesk.com/` and add `?zcli_apps=true` to the URL to see the app running.
4. Optionally, override the default sandbox API key with your own by updating the `VITE_TANGLE_API_KEY` environment variable.

### Production environment
*Note: the app mostly doesn't work when running the production version locally, as it will try to use Zendesk Proxy, which doesn't support secure parameters when running locally. Instead, deploy the app. Here's the instructions on how to run locally, anyway.*

1. Open a new terminal and run the commands:

```
bun run build
bun run start:prod
```

2. Open your browser and go to your Zendesk instance `https://<your-subdomain>.zendesk.com/` and add `?zcli_apps=true` to the URL to see the app running.


## Environment variables

- `VITE_TANGLE_API_KEY`: By default, the app is configured to use the sandbox API key that always returns a fake response. You can [get your own API key on Tangle](https://tangle.soy?ref=gh).

## Deploying
On deploy, the app will ask for an API key. You can use the sandbox API key — `ALWAYS_RETURN_DEMO_DATA` — or [get your own API key on Tangle](https://tangle.soy?ref=gh).

To check that your app will pass the server-side validation check, run:

```
zcli apps:validate dist
```

If validation is successful, you can upload the app into your Zendesk account by running:

```
zcli apps:create dist
```

To update your app after it has been created in your account, run:

```
zcli apps:update dist
```

Or, to create a zip archive for manual upload, run:

```
zcli apps:package dist
```
