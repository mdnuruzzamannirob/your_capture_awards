"use client";

import { useGetInitialCountQuery } from "@/store/features/counter/counterApi";
import { decrement, increment } from "@/store/features/counter/counterSlice";
import { useAppSelector, useAppDispatch } from "@/store/hooks";

export default function Counter() {
  const count = useAppSelector((s) => s.counter.value);
  const dispatch = useAppDispatch();
  const { data } = useGetInitialCountQuery();

  return (
    <div className="flex flex-col items-center gap-3">
      <h2 className="text-lg font-semibold">Count: {count}</h2>
      <p className="text-sm text-gray-500">
        API Count: {data !== undefined ? data : "loading..."}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => dispatch(decrement())}
          className="px-3 py-1 bg-gray-700 text-white rounded"
        >
          -
        </button>
        <button
          onClick={() => dispatch(increment())}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}
