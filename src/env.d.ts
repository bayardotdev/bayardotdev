/// <reference path="../.astro/types.d.ts" />

type Env = {
    AI: any;
};

declare namespace App {
    interface Locals {
        runtime: {
            env: Env;
            ctx: ExecutionContext;
            cf: any;
        };
    }
}
