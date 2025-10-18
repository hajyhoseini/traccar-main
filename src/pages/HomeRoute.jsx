// src/pages/HomeRoute.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../common/components/Loader";
import App from "../App";
import fetchOrThrow from "../common/util/fetchOrThrow";
import { devicesActions, sessionActions } from "../store";
import { generateLoginToken } from "../common/components/NativeInterface";
import landing from "./landing";

export default function HomeRoute() {
  const user = useSelector((s) => s.session.user);
  const dispatch = useDispatch();
  const { pathname, search } = useLocation();
  const query = new URLSearchParams(search);
  const navigate = useNavigate();

  const [checking, setChecking] = useState(user == null); // اگر user=null => باید چک کنیم

  useEffect(() => {
    let mounted = true;
    (async () => {
      // اگر user از قبل هست، لازم نیست دوباره چک کنیم
      if (user) {
        if (mounted) setChecking(false);
        return;
      }

      try {
        // ۱) locale (در صورت نیاز) — اگر از Localization استفاده می‌کنی می‌تونی اینجا setLocalLanguage صدا بزنی.
        // ۲) token در URL -> لاگین با توکن
        if (query.get("token")) {
          await fetch(`/api/session?token=${encodeURIComponent(query.get("token"))}`);
          // پس از ساخت session، بیایم user را بخوانیم
          const r = await fetch("/api/session");
          if (r.ok) {
            const u = await r.json();
            dispatch(sessionActions.updateUser(u));
          }
          // پاک کردن query از URL (اختیاری) — اما مسیر فعلی را نگه می‌داریم
          navigate(pathname, { replace: true });
          if (mounted) setChecking(false);
          return;
        }

        // ۳) deviceId on root -> select device
        if (pathname === "/" && query.get("deviceId")) {
          const response = await fetchOrThrow(`/api/devices?uniqueId=${query.get("deviceId")}`);
          const items = await response.json();
          if (items.length > 0) {
            dispatch(devicesActions.selectId(items[0].id));
          }
          navigate("/", { replace: true });
          if (mounted) setChecking(false);
          return;
        }

        // ۴) eventId -> مستقیم به صفحه event برو
        if (query.get("eventId")) {
          navigate(`/event/${query.get("eventId")}`, { replace: true });
          if (mounted) setChecking(false);
          return;
        }

        // ۵) openid success -> تولید توکن لاگین
        if (query.get("openid") === "success") {
          generateLoginToken();
          navigate("/", { replace: true });
          if (mounted) setChecking(false);
          return;
        }

        // ۶) در نهایت: چک معمولی session
        const resp = await fetch("/api/session");
        if (resp.ok) {
          const u = await resp.json();
          dispatch(sessionActions.updateUser(u));
        }
      } catch (err) {
        // نادیده‌گيری خطا — کاربر نا‌لاگین خواهد ماند
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  if (checking) return <Loader />;

  // اگر کاربر لاگین هست، App را نمایش بده (بنابراین "/" مستقیماً محتوای main را می‌دهد)
  if (user) {
    return <App />;
  }

  // در غیر این صورت لندینگ
  return <landing />;
}
