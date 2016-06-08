begin;

CREATE TABLE sleeps (
    id integer NOT NULL,
    device character varying(255),
    value integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.sleeps OWNER TO htpc;

CREATE SEQUENCE sleeps_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sleeps_id_seq OWNER TO htpc;

ALTER SEQUENCE sleeps_id_seq OWNED BY sleeps.id;

ALTER TABLE ONLY sleeps ALTER COLUMN id SET DEFAULT nextval('sleeps_id_seq'::regclass);

ALTER TABLE ONLY sleeps
    ADD CONSTRAINT sleeps_pkey PRIMARY KEY (id);

commit;
