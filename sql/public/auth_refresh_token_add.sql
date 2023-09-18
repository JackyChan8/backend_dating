-- FUNCTION: public.auth_refresh_token_add(integer, character varying, timestamp without time zone)

-- DROP FUNCTION IF EXISTS public.auth_refresh_token_add(integer, character varying, timestamp without time zone);

CREATE OR REPLACE FUNCTION public.auth_refresh_token_add(
	_id integer,
	_rtkn character varying,
	_expt timestamp without time zone)
    RETURNS boolean
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	_rt refresh_tokens;
BEGIN
	SELECT *
	FROM refresh_tokens
	WHERE user_id = _id
	INTO _rt;

	IF _rt.id ISNULL THEN
		INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES(_id, _rtkn, _expt);
		RETURN TRUE;
	ELSE
		UPDATE refresh_tokens SET token = _rtkn, expires_at = _expt WHERE user_id = _id;
		RETURN TRUE;
	END IF;
END;
$BODY$;

ALTER FUNCTION public.auth_refresh_token_add(integer, character varying, timestamp without time zone)
    OWNER TO postgres;
