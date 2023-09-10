CREATE OR REPLACE FUNCTION public.uid(
	_cnt integer)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    chars TEXT[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,H,K,L,M,N,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,k,l,m,n,p,q,r,s,t,u,v,w,x,y,z}';
    str TEXT DEFAULT '';
    i INT DEFAULT 0;
BEGIN
    LOOP
    str = '';
    FOR i IN 1.._cnt LOOP
        str := str || chars[1+random()*(array_length(chars, 1)-1)];
    END LOOP;
    EXIT WHEN NOT EXISTS(SELECT * FROM users WHERE uid = str);
    END LOOP;
    RETURN str;
END;
$BODY$;