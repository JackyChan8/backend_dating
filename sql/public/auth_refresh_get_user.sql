-- FUNCTION: public.auth_refresh_get_user(character varying)

-- DROP FUNCTION IF EXISTS public.auth_refresh_get_user(character varying);

CREATE OR REPLACE FUNCTION public.auth_refresh_get_user(
	_rtkn character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
	_rt refresh_tokens;
	_response JSONB;
BEGIN
	SELECT *
	FROM refresh_tokens
	WHERE token = _rtkn
	INTO _rt;

	IF _rt.id ISNULL THEN
		RAISE EXCEPTION 'пользователя с таким токеном не существует';
	END IF;

	SELECT
		COALESCE(argu.s, '[]')
	FROM
	(
		SELECT json_agg(ag.*)::JSONB s
		FROM (
			SELECT u.id, u.email
            FROM users u, refresh_tokens rt
			WHERE u.id = rt.user_id
			AND rt.token = _rtkn
		) ag
	) argu
	INTO _response;

	RETURN _response;
END;
$BODY$;

ALTER FUNCTION public.auth_refresh_get_user(character varying)
    OWNER TO postgres;
