--
-- PostgreSQL database dump
--

\restrict KMfaZ4RUzS0ixJo8mhwpyQIZIkNTjf65P2mQ6CvJPdPaWcZQmfG2dfF21XRXUyW

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Category" AS ENUM (
    'UPCYCLED_GOODS',
    'ORGANIC',
    'ZERO_WASTE'
);


ALTER TYPE public."Category" OWNER TO postgres;

--
-- Name: NewsStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NewsStatus" AS ENUM (
    'PUBLISHED',
    'DRAFT',
    'ARCHIVED'
);


ALTER TYPE public."NewsStatus" OWNER TO postgres;

--
-- Name: NewsVisibility; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NewsVisibility" AS ENUM (
    'PUBLIC',
    'PRIVATE'
);


ALTER TYPE public."NewsVisibility" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: StockLabel; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StockLabel" AS ENUM (
    'IN_STOCK',
    'BULK_AVAILABLE',
    'OUT_OF_STOCK'
);


ALTER TYPE public."StockLabel" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: News; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."News" (
    id text NOT NULL,
    title text NOT NULL,
    category text NOT NULL,
    content text NOT NULL,
    "imageUrl" text,
    status public."NewsStatus" DEFAULT 'DRAFT'::public."NewsStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "publishDate" timestamp(3) without time zone,
    slug text NOT NULL,
    summary text,
    tags text[],
    authors text[],
    visibility public."NewsVisibility" DEFAULT 'PUBLIC'::public."NewsVisibility" NOT NULL,
    "endDate" timestamp(3) without time zone,
    partnership text
);


ALTER TABLE public."News" OWNER TO postgres;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    price numeric(12,2) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    image text,
    category public."Category" NOT NULL,
    description text,
    "priceUnit" text,
    "productCode" text NOT NULL,
    stock integer NOT NULL,
    "stockLabel" public."StockLabel" NOT NULL,
    "whatsappLink" text
);


ALTER TABLE public."Product" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'ADMIN'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: News; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."News" (id, title, category, content, "imageUrl", status, "createdAt", "updatedAt", "publishDate", slug, summary, tags, authors, visibility, "endDate", partnership) FROM stdin;
cmp9m36000000ak7qkt0v3hpj	Test Berita	Edukasi	Ini adalah konten test berita untuk upload gambar	\N	PUBLISHED	2026-05-17 10:07:43.392	2026-05-17 10:07:43.392	\N	test-berita	Ini adalah konten test berita untuk upload gambar	{news}	{Admin}	PUBLIC	\N	\N
cmp9m6gob0002ak7qwnd149wz	Test Gambar Upload	Edukasi	Ini konten test upload gambar berita	\N	PUBLISHED	2026-05-17 10:10:17.195	2026-05-17 10:10:17.195	\N	test-gambar-upload	Ini konten test upload gambar berita	{news}	{Admin}	PUBLIC	\N	\N
cmp9n24q60000bw7qa1hmbo38	vivi	Edukasi	woow	uploads/news/news-1779014094691-971491807.jpeg	PUBLISHED	2026-05-17 10:34:54.702	2026-05-17 10:34:54.702	\N	vivi	woow	{news}	{Admin}	PUBLIC	\N	\N
cmp9nxcnn0000wq7qfbfg2wsm	neko	Edukasi	charlotte	uploads/news/news-1779015551301-439610372.png	PUBLISHED	2026-05-17 10:59:11.315	2026-05-17 10:59:48.838	\N	nao	charlotte	{}	{Admin}	PUBLIC	\N	\N
cmpodis8k0002j97q1t0usirf	keren	Edukasi	kk<b>kk<i>kk<u>kk</u></i></b><div><blockquote><ol><li><b><i><u><br></u></i></b></li></ol></blockquote></div>	uploads/news/news-1779905068142-940801721.jpg	PUBLISHED	2026-05-27 18:04:28.148	2026-05-28 01:20:23.568	2026-05-28 00:00:00	keren	shuuka shhuu	{Sehat,jasmani}	{Admin}	PUBLIC	2026-05-29 00:00:00	Telu
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Product" (id, name, price, "createdAt", image, category, description, "priceUnit", "productCode", stock, "stockLabel", "whatsappLink") FROM stdin;
cmp2m17jx0006uq7qua8b5hrt	Tas	45000.00	2026-05-12 12:31:48.861	\N	UPCYCLED_GOODS	Tas Rajut dengan desain unik dan ramah lingkungan.	pcs	TP-UP-001	30	IN_STOCK	https://wa.me/6281234567890
cmp2m47hg0007uq7qjfyqkn01	Anyaman kucing	45000.00	2026-05-12 12:34:08.74	\N	UPCYCLED_GOODS	Anyaman Kucing dengan desain unik dan ramah lingkungan.	pcs	TP-UP-002	30	IN_STOCK	https://wa.me/6281234567890
cmp7yvwei0000n17qnb46z1du	Jam	45000.00	2026-05-16 06:30:27.018	\N	UPCYCLED_GOODS	Anyaman Kucing dengan desain unik dan ramah lingkungan.	pcs	TP-UP-003	30	IN_STOCK	https://wa.me/6281234567890
cmpb62rb00000zu7q41iqsepy	Trick	45000.00	2026-05-18 12:15:02.844	\N	UPCYCLED_GOODS	Anyaman Kucing dengan desain unik dan ramah lingkungan.	pcs	TP-UP-004	30	IN_STOCK	https://wa.me/6281234567890
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
cmp0zaaor0000yy7q2kak6i24	Super Admin	admin@temanpilah.com	$2b$12$hVyNh/pr7h4X6V8SDaXIEOTYRKMf3pqgdy66Nlcni3wbhUSF84Mem	ADMIN	2026-05-11 09:07:15.483	2026-05-11 09:07:15.483
	Super Admin	adminsh@temanpilah.com	$2b$10$I3Oz0Xoerb3Y7HQPcGWbP.g0Re1DoGBMT/y3p/CBzitoTgKhlODXe	ADMIN	2026-05-17 06:36:30.196	1969-12-31 17:00:00
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
1fea4671-b3a8-490a-897e-6543a1e88c1e	84256d86059b97b2a5a47cd3fa60606010ca1b6b9cd5eac6ea95bc78f5d4d9e6	2026-05-11 09:54:35.620037+07	20260505112816_init	\N	\N	2026-05-11 09:54:35.605782+07	1
e9cdc0a2-985b-4627-bcbf-910f6297d044	13922ea084ded4cf1b4c3102df2926c573cb60566bf57555984e5af202b0c853	2026-05-11 09:54:35.629899+07	20260505113105_init	\N	\N	2026-05-11 09:54:35.622481+07	1
1506ae71-ab93-462e-bfef-d49558b6231e	e2a89be7608851138c42ec530da8633310726e15b0206b1fbf21b8e9be023a6a	2026-05-11 09:54:35.650851+07	20260507110456_add_table_products	\N	\N	2026-05-11 09:54:35.632342+07	1
07697d02-020f-4011-873c-7024cc824037	33ef619c1f95f127d6b6ff8aaea4d04d805a03c4ed89bbe6618a2307237b4d90	2026-05-11 09:54:35.664766+07	20260507110646_add_table_news	\N	\N	2026-05-11 09:54:35.653413+07	1
07fb2cd7-7205-458f-836e-901afef26b07	6864246ac6b737dde6943c9e4aabc61eb31285794a9ab9180f1c018b58da0557	2026-05-11 09:54:35.681314+07	20260507110808_add_table_user	\N	\N	2026-05-11 09:54:35.66737+07	1
8d3a0cd8-bb79-4979-808a-3a3bb958ccb0	1291e3a693a64f7d229f06ce973be68794e30516ccb41f8e7c8557b3e60b0221	2026-05-11 09:54:35.697068+07	20260508105639_init	\N	\N	2026-05-11 09:54:35.68385+07	1
593bf9bc-eed1-421f-a92a-d06c72fd01bf	563f6e6ad58f176f78698301174bef741014432a73dcc353e2b311f074c2d83e	2026-05-11 09:54:35.710236+07	20260509141426_add_table_news	\N	\N	2026-05-11 09:54:35.699626+07	1
\.


--
-- Name: News News_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."News"
    ADD CONSTRAINT "News_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: News_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "News_slug_key" ON public."News" USING btree (slug);


--
-- Name: Product_productCode_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Product_productCode_key" ON public."Product" USING btree ("productCode");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- PostgreSQL database dump complete
--

\unrestrict KMfaZ4RUzS0ixJo8mhwpyQIZIkNTjf65P2mQ6CvJPdPaWcZQmfG2dfF21XRXUyW

