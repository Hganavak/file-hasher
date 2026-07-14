import { act, renderHook } from "@testing-library/react";
import { createFakeWorkerFactory } from "@/test/fakeWorker";
import { useFileHash } from "./useFileHash";

describe("useFileHash", () => {
  it("starts in the idle state", () => {
    const { result } = renderHook(() => useFileHash());

    expect(result.current.state).toEqual({ status: "idle" });
  });

  it("transitions idle -> hashing when a file is provided", () => {
    const { createWorker } = createFakeWorkerFactory();
    const { result } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    expect(result.current.state).toEqual({
      status: "hashing",
      file,
      bytesHashed: 0,
      totalBytes: 0,
    });
  });

  it("updates bytesHashed as progress messages arrive", () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const { result } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    act(() => {
      workers[0]!.emit({ type: "progress", bytesHashed: 10, totalBytes: 100 });
    });

    expect(result.current.state).toEqual({
      status: "hashing",
      file,
      bytesHashed: 10,
      totalBytes: 100,
    });

    act(() => {
      workers[0]!.emit({ type: "progress", bytesHashed: 90, totalBytes: 100 });
    });

    expect(result.current.state).toEqual({
      status: "hashing",
      file,
      bytesHashed: 90,
      totalBytes: 100,
    });
  });

  it("transitions to done with the hash on a done message", () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const { result } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    act(() => {
      workers[0]!.emit({ type: "done", hash: "1234567890" });
    });

    expect(result.current.state).toEqual({
      status: "done",
      file,
      hash: "1234567890",
    });
  });

  it("transitions to error on an error message", () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const { result } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    act(() => {
      workers[0]!.emit({ type: "error", message: "test error" });
    });

    expect(result.current.state).toEqual({
      status: "error",
      file,
      message: "test error",
    });
  });

  it("retry() re-hashes the same file after an error", () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const { result } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    act(() => {
      workers[0]!.emit({ type: "error", message: "test error" });
    });

    act(() => {
      result.current.retry();
    });

    expect(workers).toHaveLength(2);
    expect(workers[1]!.postMessage).toHaveBeenCalledWith({
      type: "hash",
      file,
    });
    expect(result.current.state).toEqual({
      status: "hashing",
      file,
      bytesHashed: 0,
      totalBytes: 0,
    });
  });

  it("retry() does nothing unless in the error state", () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const { result } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    act(() => {
      result.current.retry();
    });

    expect(workers).toHaveLength(1);
    expect(workers[0]!.terminate).not.toHaveBeenCalled();
  });

  it("terminates the old worker when a new file is selected", () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const { result } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    act(() => {
      result.current.startHashing(file);
    });

    expect(workers[1]!.terminate).not.toHaveBeenCalled();
    expect(workers[0]!.terminate).toHaveBeenCalled();
  });

  it("terminates the worker on unmount", () => {
    const { workers, createWorker } = createFakeWorkerFactory();
    const { result, unmount } = renderHook(() => useFileHash(createWorker));
    const file = new File([], "test.txt");

    act(() => {
      result.current.startHashing(file);
    });

    unmount();

    expect(workers[0]!.terminate).toHaveBeenCalled();
  });
});
