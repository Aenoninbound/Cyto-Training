class DijkstraAlgorithm {
    constructor(graph) {
      this.graph = graph;
    }
  
    dijkstra(source) {
      const distances = {};
      const previous = {};
      const priorityQueue = new PriorityQueue();
  
      // Initialization
      for (const node in this.graph) {
        distances[node] = Infinity;
        previous[node] = null;
        priorityQueue.enqueue(node, Infinity);
      }
  
      distances[source] = 0;
  
      while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.dequeue();
  
        for (const neighbor in this.graph[current]) {
          const alt = distances[current] + this.graph[current][neighbor];
          if (alt < distances[neighbor]) {
            distances[neighbor] = alt;
            previous[neighbor] = current;
            priorityQueue.enqueue(neighbor, alt);
          }
        }
      }
  
      return { distances, previous };
    }
  
    getPath(source, destination, previous) {
      const path = [];
      let current = destination;
  
      while (current !== null) {
        path.unshift(current);
        current = previous[current];
      }
  
      return path;
    }
  }
  
  class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(element, priority) {
      this.queue.push({ element, priority });
      this.sort();
    }
  
    dequeue() {
      return this.queue.shift().element;
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  
    sort() {
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  }
  
  export default DijkstraAlgorithm;
  