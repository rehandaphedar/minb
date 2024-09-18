# Introduction

![minb](https://git.sr.ht/~rehandaphedar/minb/blob/main/static/favicon.png)

minb is a recreation of [Basecamp Todos](https://basecamp.com/features/hill-charts), built with SvelteKit, Supabase, and Bulma CSS.

- [Demo](https://minb.demos.rehandaphedar.com) (If the demo has issues, it is probably because it is paused on Supabase. Feel free to contact me, and I will unpause it swiftly.)

# Screenshots

![Home Page](https://git.sr.ht/~rehandaphedar/minb/blob/main/assets/screenshot-1.png)

---

![Projects Page](https://git.sr.ht/~rehandaphedar/minb/blob/main/assets/screenshot-2.png)

---

![Project Page: Progress Overview](https://git.sr.ht/~rehandaphedar/minb/blob/main/assets/screenshot-3.png)

---

![Project Page: Incomplete Todo Group](https://git.sr.ht/~rehandaphedar/minb/blob/main/assets/screenshot-4.png)

---

![Project Page: Completed Todo Group](https://git.sr.ht/~rehandaphedar/minb/blob/main/assets/screenshot-5.png)

# Install Instructions

## Docker + Compose

Navigate to an empty directory

```shell
mkdir minb
cd minb
```

Download `docker-compose.yaml`

```shell
wget https://git.sr.ht/~rehandaphedar/minb/blob/main/docker-compose.yaml
```

Run the container

```shell
docker compose up
```

## Manual

### Build Dependencies

- `node`

### Runtime Dependencies

- `node`

### Building

Clone the source code

```shell
git clone https://git.sr.ht/~rehandaphedar/minb
cd minb
```

Install dependencies and build

```shell
pnpm i # (Or `npm i` etc.)
pnpm build # (Or `npm run build` etc.)
```

### Deploying

Copy the `package.json` file and the `build` folder. Then, install dependencies, set environment variables, and run:

```shell
npm i --production
node build
```

# Misc

- You can use the [nohup](https://linux.die.net/man/1/nohup) command to easily redirect logs to a file. Also helpful when trying to keep the app alive after exiting an SSH session.
