import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchformComponent } from './searchform/searchform.component';
import { RedirectGuard } from './searchform/redirect.guard';
import { inject } from '@angular/core';
export const routes: Routes = [
    {path: "", redirectTo:"search/home"},
    {path: "search", redirectTo:"search/home"},
    {path: "search/home", canActivate: [() => inject(RedirectGuard).canActivate()], component:SearchformComponent},
    {path:"search/:ticker",component:SearchformComponent},
    {path:"watchlist",component:WatchlistComponent},
    {path:"portfolio",component: PortfolioComponent},
];