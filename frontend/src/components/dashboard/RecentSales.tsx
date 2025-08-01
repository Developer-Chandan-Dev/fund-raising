import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const salesData = [
  { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "$1,999.00" },
  { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "$1,499.00" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "$899.00" },
  { name: "William Kim", email: "will@email.com", amount: "$799.00" },
  { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "$599.00" },
];

export const RecentSales = () => {
  return (
    <div className="space-y-8">
      {salesData.map((sale, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>{sale.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.name}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
          </div>
          <div className="ml-auto font-medium">{sale.amount}</div>
        </div>
      ))}
    </div>
  );
};