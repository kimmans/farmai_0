import { Link } from "react-router";
import { Separator } from "~/common/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

const menus = [
  {
    name: "Farms",
    to: "/farms/myfarms",
    items: [
      {
        name: "View Farms List",
        description: "View and manage your farms",
        to: "/farms/myfarms",
      },
      {
        name: "Add New Farm",
        description: "Register a new farm",
        to: "/farms/new",
      },
    ],
  },
];

export default function Navigation({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return (
    <nav className="flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
      <div className="flex items-center">
        <Link to="/" className="font-bold tracking-tighter text-lg">
          Farmai
        </Link>
        <Separator orientation="vertical" className="h-6 mx-4" />
        <NavigationMenu>
          <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem key={menu.name}>
                {menu.items ? (
                  <>
                    <Link to={menu.to}>
                      <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                    </Link>
                    <NavigationMenuContent>
                      <div className="grid w-[400px] gap-3 p-4">
                        <ul className="grid gap-3">
                          {menu.items?.map((item) => (
                            <NavigationMenuItem
                              key={item.name}
                              className="select-none rounded-md transition-colors focus:bg-accent hover:bg-accent"
                            >
                              <NavigationMenuLink>
                                <Link
                                  className="p-3 space-y-1 block leading-none no-underline outline-none"
                                  to={item.to}
                                >
                                  <span className="text-sm font-medium leading-none">
                                    {item.name}
                                  </span>
                                  <p className="text-sm leading-snug text-muted-foreground">
                                    {item.description}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </NavigationMenuItem>
                          ))}
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link className={navigationMenuTriggerStyle()} to={menu.to}>
                    {menu.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild variant="secondary">
          <Link to="/auth/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/auth/join">Join</Link>
        </Button>
      </div>
    </nav>
  );
}