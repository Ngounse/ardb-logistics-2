"use client";

import { MyHashID } from "@/components/myFunction";
import { FormatByOrderType } from "@/components/OrderType";
import { MyPagination } from "@/components/Pagination";
import { ShipmentPriorityBadge } from "@/components/shipments/shipmentsComponent/shipment-priority-badge";
import { MySelectContent, MyShowingItem } from "@/components/Showing-item";
import { MyNoItemTableRow } from "@/components/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from '@/lib/axios';
import { PagingT } from "@/lib/response";
import { BaseFeeUrl } from "@/lib/ServiceUrl";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { BaseFeeHistoryT, BaseFeeParam } from "./utility";

interface BaseFeelogsProps {
  readonly baseFeeParam?: BaseFeeParam;
}

export default function BaseFeeLogsPage({
  baseFeeParam,
}: BaseFeelogsProps) {
  const [baseFeeHis, setbaseFeeHis] = useState<BaseFeeHistoryT[]>([])
  const [pagination, setPagination] = useState<PagingT<BaseFeeHistoryT> | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(process.env.NEXT_PUBLIC_PAGE_SIZE ? Number.parseInt(process.env.NEXT_PUBLIC_PAGE_SIZE) : 10);
  const [orderTypes, setOrderTypes] = useState<string>('all');

  useEffect(() => {
    getBaseFeeHis();
  }, [orderTypes]);

  const getBaseFeeHis = () => {
    api.get(`${BaseFeeUrl}/history`, {
      params: {
        page, size, orderTypes: orderTypes == 'all' ? undefined : orderTypes
      }
    }).then((res) => {
      const d: PagingT<BaseFeeHistoryT> = res.data.data
      setPagination(d);
      setbaseFeeHis(d.result);
    });
  }

  return (
    <><Select defaultValue={"all"} value={orderTypes} onValueChange={(value) => setOrderTypes(value)}>
      <SelectTrigger className=" w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Order Types</SelectItem>
        {baseFeeParam?.orderTypes.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
      <Card>
        <CardContent>
          <Table className="whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Order Type</TableHead>
                <TableHead className="text-center">Fee Type</TableHead>
                <TableHead>Base Amount</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <MyNoItemTableRow name="base fee history" items={baseFeeHis} />
              {baseFeeHis?.map((log) => {
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      {MyHashID(log.id)}
                    </TableCell>

                    <TableCell className="text-center"><ShipmentPriorityBadge priority={log.orderType} /> </TableCell>
                    <TableCell className="text-center">{log.feeType}</TableCell>
                    <TableCell>  {FormatByOrderType(log.baseAmount, log.feeType)} </TableCell>
                    <TableCell>{log.note}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          {/* <Image
                          src={log.user.avatar || "/placeholder.svg"}
                          alt="..."
                        /> */}
                          <AvatarFallback>
                            {log.createdBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{log.createdBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {format(log.createdAt, "yyyy-MM-dd, HH:mm:ss")}
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <MyShowingItem pagination={pagination} />
              <Select defaultValue={size.toString()}
                onValueChange={(value) => {
                  setPage(0); // reset to first page
                  setSize(Number(value));
                }} >
                <MySelectContent />
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <MyPagination
                currentPage={pagination?.currentPage ?? 0}
                totalPage={pagination?.totalPage ?? 1}
                onPageChange={setPage} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
