/// <reference path="../.astro/types.d.ts" />

type ENV = {
    AI: any;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
    interface Locals extends Runtime { }
}
