use std::collections::HashMap;

fn sort_hashmap_by_key(map: &mut HashMap<usize, i32>) -> Vec<(usize, i32)> {
    let mut sorted_map: Vec<(usize, i32)> = map.iter().map(|(&k, &v)| (k, v)).collect();
    sorted_map.sort_by_key(|&x| x.0);
    sorted_map
}

fn main() {
    let mut my_map: HashMap<usize, i32> = HashMap::new();
    my_map.insert(4, 100);
    my_map.insert(2, 200);
    my_map.insert(1, 300);
    my_map.insert(3, 400);

    let sorted_map = sort_hashmap_by_key(&mut my_map);

    for (key, value) in sorted_map {
        println!("{}: {}", key, value);
    }
}
