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
import FarmCard from "~/features/components/farm-card";

const menus = [
  {
    name: "My Farms",
    to: "/farms/myfarms",
    items: [
      {
        name: "View My Farms",
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

const recentFarms = [
  {
    id: "1",
    name: "Green Valley Farm",
    location: "제주 애월읍",
    ownerName: "양관식",
    lastUpdated: "2024-03-20",
  },
  {
    id: "2",
    name: "Sunny Fields",
    location: "경기 화성시",
    ownerName: "양금명",
    lastUpdated: "2024-03-19",
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
                      <div className="grid w-[800px] gap-3 p-4 md:w-[800px] md:grid-cols-2">
                        <div className="col-span-1">
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
                        <div className="col-span-1">
                          <h4 className="mb-2 text-sm font-medium">Recent Farms</h4>
                          <div className="space-y-2">
                            {recentFarms.map((farm) => (
                              <FarmCard key={farm.id} {...farm} />
                            ))}
                          </div>
                        </div>
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