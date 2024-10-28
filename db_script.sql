-- Table: public.task

-- DROP TABLE IF EXISTS public.task;

CREATE TABLE IF NOT EXISTS public.task
(
    id integer NOT NULL DEFAULT nextval('task_id_seq'::regclass),
    task_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    task_description text COLLATE pg_catalog."default",
    status character varying(50) COLLATE pg_catalog."default" DEFAULT 'New'::character varying,
    created_datetime timestamp with time zone DEFAULT now(),
    updated_datetime timestamp with time zone DEFAULT now(),
    CONSTRAINT task_pkey PRIMARY KEY (id),
    CONSTRAINT task_status_check CHECK (status::text = ANY (ARRAY['New'::character varying, 'WIP'::character varying, 'On hold'::character varying, 'Cancelled'::character varying, 'Completed'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.task
    OWNER to postgres;