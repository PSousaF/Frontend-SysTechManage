import { Routes } from '@angular/router';
import { LoginComponent } from './components/view/login/login.component';
import { MainComponent } from './components/view/main/main.component';
import { InternalLayoutComponent } from './components/others/internal-layout/internal-layout.component';
import { BudgetComponent } from './components/view/budget/budget.component';
import { OrdersComponent } from './components/view/orders/orders.component';
import { PeoplesComponent } from './components/view/peoples/peoples.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { title: 'Login' }},
  { path: '', component: LoginComponent, data: { title: 'Login' }},
  { path: 'main', component: InternalLayoutComponent,  data: { title: 'Main' },
    children: [
      { path: '', component: MainComponent }
    ],
  },
  { path: 'orcamento', component: InternalLayoutComponent, data: { title: 'Orçamento' },
    children: [
      { path: '', component: BudgetComponent }
    ],
  },
  { path: 'ordens', component: InternalLayoutComponent, data: { title: 'Ordens' },
    children: [
      { path: '', component: OrdersComponent }
    ],
  },
  { path: 'cadastros', component: InternalLayoutComponent, data: { title: 'Clientes e Usuários' },
    children: [
      { path: '', component: PeoplesComponent }
    ],
  }
];