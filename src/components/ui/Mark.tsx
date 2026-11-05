/** The Lumetic mark as live vector: crisp at any size and it inherits text color. */
export default function Mark({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1373 1476" className={className} fill="currentColor" aria-hidden focusable="false">
      <path
        fillRule="evenodd"
        d="M0 18Q0 0 18 0H535Q595 0 595 60V843Q595 863 615 863H1353Q1373 863 1373 883V1456Q1373 1476 1353 1476H20Q0 1476 0 1456ZM205 225V1248Q205 1263 220 1263H1155Q1170 1263 1170 1248V1085Q1170 1070 1155 1070H405Q390 1070 390 1055V225Q390 210 375 210H220Q205 210 205 225Z"
      />
      <path
        fillRule="evenodd"
        d="M782 60Q782 0 842 0H1315Q1373 0 1373 58V590Q1373 645 1318 645H837Q782 645 782 590ZM986 225V422Q986 437 1001 437H1155Q1170 437 1170 422V225Q1170 210 1155 210H1001Q986 210 986 225Z"
      />
    </svg>
  );
}
