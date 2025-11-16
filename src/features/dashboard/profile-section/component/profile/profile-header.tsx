interface ProfileHeaderProps {
  userName?: string;
}

export function ProfileHeader({ userName }: ProfileHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8 md:mb-10">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
        Selamat Datang Kembali!{" "}
        {userName && <span className="text-purple-600">{userName}</span>}
      </h1>
    </div>
  );
}
