// app/not-found.tsx
import NotFoundPage from '../../shared/common/NotFoundPage'

export const metadata = {
  title: '404 - Page Not Found | DevCollab',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
     console.log("the admin not foudn")
  return <NotFoundPage homeLink='/admin/dashboard' />;
}