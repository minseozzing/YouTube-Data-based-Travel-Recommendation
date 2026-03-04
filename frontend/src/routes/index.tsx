import { createFileRoute } from "@tanstack/react-router";
import HomePage from "../pages/home"; // 또는 "@/pages/home/index" (alias 설정에 따라)

export const Route = createFileRoute("/")({
  component: HomePage,
});
