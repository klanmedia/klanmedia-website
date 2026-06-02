// Server Component — holt Flags und übergibt sie an den Client-Navbar
import { getFlags } from '@/lib/flags'
import Navbar from './Navbar'

export default async function NavbarWrapper() {
  const flags = await getFlags()
  return <Navbar flags={flags} />
}
